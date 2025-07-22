# Load libraries
library(dplyr)
library(sf)
library(rmapshaper)
library(stringr)

# In RStudio set working directory to the path where this R script is located
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# Function to ready gpkg for json export
gpkg2json <- function(gpkg_path, variable, digits = 1, simplify = TRUE, sys = TRUE, RAM = 16) {
  
  # Read in geopackage
  cat("Reading in data ...\n\n")
  gpkg <- st_read(gpkg_path)
  
  # Filter data and round to X decimal places
  cat("Filtering data ...\n\n")
  geodata <- gpkg |> 
    mutate(across(c(ba_anom, cem_emAn, gfa_nFAnP, gfa_95FAP, gfa_95RAP), \(x) round(x, digits = digits))) |> 
    # Remove rows other than total (will reduce data by 1/3!)
    filter(land_cov == "Total") |> 
    # Only extract data for layer of interest
    filter(reg_layer == variable)
  
  # Reduce vertices but keep shapes
  if (simplify) {
    cat("Simplifying data ...\n\n")
    geodata <- ms_simplify(geodata, keep_shapes = TRUE, keep = 0.10, sys = sys, sys_mem = RAM)
  }
  
  # Return geodata
  return(geodata)
}

# Countries
file <- "Countries_DataViz_Interactive_Map.gpkg"
variable <- str_extract(file, "(?<=).*?(?=_DataViz)")
gpkg <- gpkg2json(file, variable, simplify = TRUE)
lobstr::obj_size(gpkg)
# plot(st_geometry(gpkg))
st_write(gpkg, dsn = paste0(variable, ".geojson"), append = FALSE)

# Continental Biomes
file <- "Continental_Biomes_DataViz_Interactive_Map.gpkg"
variable <- str_extract(file, "(?<=).*?(?=_DataViz)")
gpkg <- gpkg2json(file, variable, simplify = TRUE)
lobstr::obj_size(gpkg)
# plot(st_geometry(gpkg))
st_write(gpkg, dsn = paste0(variable, ".geojson"), append = FALSE)

# IPCC WGI Regions
file <- "IPCC_WGI_regions_DataViz_Interactive_Map.gpkg"
variable <- str_extract(file, "(?<=).*?(?=_DataViz)")
gpkg <- gpkg2json(file, variable, simplify = FALSE)
st_write(gpkg, dsn = paste0(variable, ".geojson"), append = FALSE)


# GADM UCDavis L1
large_sf <- st_read("GADM_UCDavis_L1_DataViz_Interactive_Map.gpkg")

# Variable
file <- "GADM_UCDavis_L1_DataViz_Interactive_Map.gpkg"
variable <- str_extract(file, "(?<=).*?(?=_DataViz)")

# Filter
large_sf <- large_sf |> 
  mutate(across(c(ba_anom, cem_emAn, gfa_nFAnP, gfa_95FAP, gfa_95RAP), \(x) round(x, digits = 1))) |> 
  # Remove rows other than total (will reduce data by 1/3!)
  filter(land_cov == "Total") |> 
  # Only extract data for layer of interest
  filter(reg_layer == variable)

# Split the sf object into chunks
chunks <- large_sf %>%
  group_by(chunk_id = ntile(1:n(), 10)) %>%
  group_split()

# Simplify each chunk individually
simplified_chunks <- lapply(chunks, function(chunk) {
  ms_simplify(chunk, keep_shapes = TRUE, keep = 0.01, sys = TRUE)
})

# Combine simplified chunks back together
simplified_sf <- do.call(rbind, simplified_chunks)
# summary(st_is_valid(simplified_sf))
lobstr::obj_size(simplified_sf)
# plot(st_geometry(simplified_sf))

# Export as geojson
st_write(simplified_sf, dsn = paste0(variable, ".geojson"), append = FALSE)
