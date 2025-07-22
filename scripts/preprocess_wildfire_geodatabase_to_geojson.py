import numpy as np
import pandas as pd
import geopandas as gpd
import subprocess
from pathlib import Path

def gpkg_to_geojson(inputfile, layer, outputdir, digits=1):
    """
    Convert a GeoPackage to a simplified GeoJSON file.

    Parameters
    ----------
    inputfile : str
        Path to GeoPackage file (.gpkg).
    layer : str
        Name of layer (e.g. "Countries").
    outputdir : str
        Path to output directory.
    digits : int, optional
        Round variables to {int} decimal places. The default is 1.

    Returns
    -------
    None. Writes a GeoJSON file.

    """
    # Read in geopackage
    gpkg = gpd.read_file(inputfile)
    
    # Keep only features with total land cover
    total_idx = gpkg["land_cov"] == "Total"
    gpkg = gpkg[total_idx]
    
    # Keep only data for layer
    layer_idx = gpkg["reg_layer"] == layer
    gpkg = gpkg[layer_idx]
    
    # Subset redundant columns to reduce output file size
    # variables = ["reg_name","reg_layer",
    #              "ba_anom","ba_rank",
    #              "cem_emAn","cem_emRk",
    #              "gfa_nFAnP","gfa_nFRk",
    #              "gfa_95FAP","gfa_95FRk",
    #              "gfa_95RAP","gfa_95RRk",
    #              "frp_95dPc","frp_95r", "geometry"]
    # gpkg = gpkg[variables]
    
    # Round all numeric columns to one decimal place
    gpkg = gpkg.round(digits)
    
    # Set coordinate reference system (CRS)
    gpkg = gpkg.set_crs("EPSG:4326", allow_override=True)
    
    # Export to non-simplifed geojson
    print(f"Writing non-simplifed {layer}.geojson file ...", flush=True)
    outputfile = f"{layer}.geojson"
    gpkg.to_file(f"{outputdir}/{outputfile}")
    print("Writing complete!", flush=True)


def simplify_geojson(inputfile, outputdir, keep=10):
    """
    Simplify polygons using external mapshaper tool

    Parameters
    ----------
    inputfile : str
        Path to GeoJSON file.
    outputdir : str
        Path to output directory.
    keep : int, optional
        Percentage of vertices to keep. The default is 10.

    Returns
    -------
    None. Writes a GeoJSON file.

    """
    # Get name of geojson file (minus the .geojson)
    filename = Path(inputfile).name.removesuffix(".geojson")
    
    # Simplify geojson using mapshaper CLI
    print("Simpifying GeoJSON using mapshaper ...", flush=True)
    subprocess.run([
        "mapshaper",
        "-i", inputfile,
        "-simplify", f"{keep}%", "keep-shapes",
        "-o", f"{outputdir}/{filename}Simplified.geojson",
    ])
    print("Writing complete!", flush=True)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Convert GeoPackages from ClimateUEA to GeoJSON files for web applications.")
    parser.add_argument("inputfile", type=str, help="Path to GeoPackage (.gpkg)")
    parser.add_argument("layer", type=str, help="Name of the layer (e.g. Continental_Biomes, Countries, Ecoregions, GADM_UCDavis_L1)")
    parser.add_argument("outputdir", type=str, help="Path to output directory")
    parser.add_argument("--simplify", action="store_true", help="Simplify GeoJSON file. The mapshaper tool must be installed and available. E.g. npm install -g mapshaper")
    parser.add_argument("--percent", default=10, type=int, help="Percentage of vertices to retain (e.g. 10 equals 10 percent)")
    args = parser.parse_args()

    # Execute main function
    gpkg_to_geojson(args.inputfile, args.layer, args.outputdir)

    # Simplify geojson if specified on command line
    if args.simplify:
        simplify_geojson(f"{args.outputdir}/{args.layer}.geojson", args.outputdir, keep=args.percent)
