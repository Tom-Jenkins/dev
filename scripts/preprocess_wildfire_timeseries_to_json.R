# Load libraries
library(readr)
library(dplyr)
library(stringr)
library(tidyr)
library(jsonlite)

# In RStudio set working directory to the path where this R script is located
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# ---------- #
# Burned Area
# ---------- #

# Read in data
burned <- read_csv("State_of_Wildfires_2023-24_Burned_Area_annual_data_with_anomalies.csv", skip = 10)
burned

# Columns to select
burned_columns <- c(
  "Region ID","Region Name","Regional Layer",
  "Fire Season Start Year","Land Cover",
  "Burned Area (km^2)"
)

# Filter
burned_filt <- burned |> 
  select(contains(burned_columns)) |> 
  # Only keep total burned area
  filter(`Land Cover` == "Total") |> 
  # One decimal place
  mutate(`Burned Area (km^2)` = round(`Burned Area (km^2)`, 0)) |> 
  select("Fire Season Start Year","Burned Area (km^2)",
         "Regional Layer", "Region Name")
burned_filt
burned_filt$`Regional Layer` |> unique()

# Build json file
burned_list <- list(
  Global = filter(burned_filt, `Regional Layer` == "Global"),
  Hemispheres = filter(burned_filt, `Regional Layer` == "Hemispheres"),
  `Hemispheres and Tropics` = filter(burned_filt, `Regional Layer` == "NH-TR-SH"),
  `RECCAP2 Regions` = filter(burned_filt, `Regional Layer` == "RECCAP2_regions"),
  `IPCC Regions` = filter(burned_filt, `Regional Layer` == "IPCC_WGI_regions"),
  Continents = filter(burned_filt, `Regional Layer` == "Continents"),
  Countries = filter(burned_filt, `Regional Layer` == "Countries"),
  `Global Fire Emissions Database Regions` = filter(burned_filt, `Regional Layer` == "GFED_regions"),
  Biomes = filter(burned_filt, `Regional Layer` == "Biomes"),
  `States and Provinces` = filter(burned_filt, `Regional Layer` == "GADM_UCDavis_L1"),
  `Continental Biomes` = filter(burned_filt, `Regional Layer` == "Continental_Biomes")
)

# Keep only columns needed for echarts
burned_list_cols <- lapply(1:length(burned_list), \(x) dplyr::select(burned_list[[x]], `Region Name`,`Fire Season Start Year`,`Burned Area (km^2)`))
names(burned_list_cols) <- names(burned_list)

# Convert each element in list to a nested list where each element is a region
burned_list_nest <- lapply(names(burned_list_cols), \(x) split(burned_list_cols[[x]], burned_list_cols[[x]]["Region Name"]) )
names(burned_list_nest) <- names(burned_list)

# ---------- #
# Emission Area
# ---------- #

# Read in data
emissions <- read_csv("State_of_Wildfires_2023-24_Carbon_Emissions_annual_data_with_anomalies.csv", skip = 9)
emissions

# Columns to select
emissions_columns <- c(
  "Region ID","Region Name","Regional Layer",
  "Fire Season Start Year",
  "Carbon Emitted", "Product"
)

# Filter
emissions_filt <- emissions |> 
  select(contains(emissions_columns)) |> 
  filter(Product == "Multi_product_mean") |>
  # Apply formula: X / 1e9 * 3.664
  mutate(`Carbon Emitted` = (`Carbon Emitted`/1e9)*3.664) |> 
  mutate(`Carbon Emitted` = round(`Carbon Emitted`, 0)) |>
  select("Fire Season Start Year","Carbon Emitted",
         "Regional Layer", "Region Name")
emissions_filt
emissions_filt$`Regional Layer` |> unique()

# Build json file
emissions_list <- list(
  Global = filter(emissions_filt, `Regional Layer` == "Global"),
  Hemispheres = filter(emissions_filt, `Regional Layer` == "Hemispheres"),
  `Hemispheres and Tropics` = filter(emissions_filt, `Regional Layer` == "NH-TR-SH"),
  `RECCAP2 Regions` = filter(emissions_filt, `Regional Layer` == "RECCAP2_regions"),
  `IPCC Regions` = filter(emissions_filt, `Regional Layer` == "IPCC_WGI_regions"),
  Continents = filter(emissions_filt, `Regional Layer` == "Continents"),
  Countries = filter(emissions_filt, `Regional Layer` == "Countries"),
  `Global Fire Emissions Database Regions` = filter(emissions_filt, `Regional Layer` == "GFED_regions"),
  Biomes = filter(emissions_filt, `Regional Layer` == "Biomes"),
  `States and Provinces` = filter(emissions_filt, `Regional Layer` == "GADM_UCDavis_L1"),
  `Continental Biomes` = filter(emissions_filt, `Regional Layer` == "Continental_Biomes")
)

# Keep only columns needed for echarts
emissions_list_cols <- lapply(1:length(emissions_list), \(x) dplyr::select(emissions_list[[x]], `Region Name`,`Fire Season Start Year`,`Carbon Emitted`))
names(emissions_list_cols) <- names(emissions_list)

# Convert each element in list to a nested list where each element is a region
emissions_list_nest <- lapply(names(emissions_list_cols), \(x) split(emissions_list_cols[[x]], emissions_list_cols[[x]]["Region Name"]) )
names(emissions_list_nest) <- names(emissions_list)

# ---------- #
# Atlas Number of Fires
# ---------- #

# Read in data
atlas <- read_csv("State_of_Wildfires_2023-24_Global_Fire_Atlas_annual_data_with_anomalies.csv", skip = 10)
atlas

# Columns to select
atlas_columns <- c(
  "Region ID","Region Name","Regional Layer",
  "Fire Season Start Year",
  "Number of Fires"
)

# Filter
atlas_filt <- atlas |> 
  select(contains(atlas_columns)) |> 
  # Convert NAs to zero
  replace_na(list("Number of Fires" = 0)) |>
  select("Fire Season Start Year","Number of Fires",
         "Regional Layer", "Region Name")
atlas_filt
atlas_filt$`Regional Layer` |> unique()

# Build json file
atlas_list <- list(
  `IPCC Regions` = filter(atlas_filt, `Regional Layer` == "IPCC_WGI_regions"),
  Countries = filter(atlas_filt, `Regional Layer` == "Countries"),
  `States and Provinces` = filter(atlas_filt, `Regional Layer` == "GADM_UCDavis_L1"),
  `Continental Biomes` = filter(atlas_filt, `Regional Layer` == "Continental_Biomes")
)

# Keep only columns needed for echarts
atlas_list_cols <- lapply(1:length(atlas_list), \(x) dplyr::select(atlas_list[[x]], `Region Name`,`Fire Season Start Year`,`Number of Fires`))
names(atlas_list_cols) <- names(atlas_list)

# Convert each element in list to a nested list where each element is a region
atlas_list_nest <- lapply(names(atlas_list_cols), \(x) split(atlas_list_cols[[x]], atlas_list_cols[[x]]["Region Name"]) )
names(atlas_list_nest) <- names(atlas_list)

# ---------- #
# Atlas 95th Fire Size
# ---------- #

# Columns to select
fire_size_columns <- c(
  "Region ID","Region Name","Regional Layer",
  "Fire Season Start Year",
  "95th Percentile Fire Size (km^2)"
)

# Filter
fire_size_filt <- atlas |> 
  select(contains(fire_size_columns)) |> 
  # Convert NAs to zero
  replace_na(list("95th Percentile Fire Size (km^2)" = 0)) |>
  # One decimal place
  mutate(`95th Percentile Fire Size (km^2)` = round(`95th Percentile Fire Size (km^2)`, 0)) |> 
  select("Fire Season Start Year","95th Percentile Fire Size (km^2)",
         "Regional Layer", "Region Name")
fire_size_filt
fire_size_filt$`Regional Layer` |> unique()

# Build json file
fire_size_list <- list(
  `IPCC Regions` = filter(fire_size_filt, `Regional Layer` == "IPCC_WGI_regions"),
  Countries = filter(fire_size_filt, `Regional Layer` == "Countries"),
  `States and Provinces` = filter(fire_size_filt, `Regional Layer` == "GADM_UCDavis_L1"),
  `Continental Biomes` = filter(fire_size_filt, `Regional Layer` == "Continental_Biomes")
)

# Keep only columns needed for echarts
fire_size_list_cols <- lapply(1:length(fire_size_list), \(x) dplyr::select(fire_size_list[[x]], `Region Name`,`Fire Season Start Year`,`95th Percentile Fire Size (km^2)`))
names(fire_size_list_cols) <- names(fire_size_list)

# Convert each element in list to a nested list where each element is a region
fire_size_list_nest <- lapply(names(fire_size_list_cols), \(x) split(fire_size_list_cols[[x]], fire_size_list_cols[[x]]["Region Name"]) )
names(fire_size_list_nest) <- names(fire_size_list)

# ---------- #
# Atlas 95th Fire Growth
# ---------- #

# Columns to select
fire_growth_columns <- c(
  "Region ID","Region Name","Regional Layer",
  "Fire Season Start Year",
  "95th Percentile Rate of Growth (km^2 day^-1)"
)

# Filter
fire_growth_filt <- atlas |> 
  select(contains(fire_growth_columns)) |> 
  # Convert NAs to zero
  replace_na(list("95th Percentile Rate of Growth (km^2 day^-1)" = 0)) |>
  # One decimal place
  mutate(`95th Percentile Rate of Growth (km^2 day^-1)` = round(`95th Percentile Rate of Growth (km^2 day^-1)`, 0)) |> 
  select("Fire Season Start Year","95th Percentile Rate of Growth (km^2 day^-1)",
         "Regional Layer", "Region Name")
fire_growth_filt
fire_growth_filt$`Regional Layer` |> unique()

# Build json file
fire_growth_list <- list(
  `IPCC Regions` = filter(fire_growth_filt, `Regional Layer` == "IPCC_WGI_regions"),
  Countries = filter(fire_growth_filt, `Regional Layer` == "Countries"),
  `States and Provinces` = filter(fire_growth_filt, `Regional Layer` == "GADM_UCDavis_L1"),
  `Continental Biomes` = filter(fire_growth_filt, `Regional Layer` == "Continental_Biomes")
)

# Keep only columns needed for echarts
fire_growth_list_cols <- lapply(1:length(fire_growth_list), \(x) dplyr::select(fire_growth_list[[x]], `Region Name`,`Fire Season Start Year`,`95th Percentile Rate of Growth (km^2 day^-1)`))
names(fire_growth_list_cols) <- names(fire_growth_list)

# Convert each element in list to a nested list where each element is a region
fire_growth_list_nest <- lapply(names(fire_growth_list_cols), \(x) split(fire_growth_list_cols[[x]], fire_growth_list_cols[[x]]["Region Name"]) )
names(fire_growth_list_nest) <- names(fire_growth_list)

# ---------- #
# JSON Export
# ---------- #

# Construct main json file and export
write_json(
  list(
    burned = burned_list_nest,
    emissions = emissions_list_nest,
    atlas = atlas_list_nest,
    fireSize = fire_size_list_nest,
    fireGrowth = fire_growth_list_nest
  ),
  path = "timeseries.json"
)

# Write json files individually
write_json(burned_list_nest, path = "timeseries_burned.json")
write_json(emissions_list_nest, path = "timeseries_emissions.json")
write_json(atlas_list_nest, path = "timeseries_atlas.json")
write_json(fire_size_list_nest, path = "timeseries_fire_size.json")
write_json(fire_growth_list_nest, path = "timeseries_fire_growth.json")

