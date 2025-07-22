import pandas as pd
import json

# Data to subset based on variable input in functions
variable_dict = {
        "burned": [10, ["Region Name","Regional Layer","Fire Season Start Year","Land Cover","Burned Area (km^2)"]],
        "emissions": [10, ["Region Name","Regional Layer","Fire Season Start Year", "Product","Carbon Emitted"]],
        "atlas": [10, ["Region Name","Regional Layer","Fire Season Start Year","Number of Fires"]],
        "fire_size": [10, ["Region Name","Regional Layer","Fire Season Start Year","95th Percentile Fire Size (km^2)"]],
        "fire_growth": [10, ["Region Name","Regional Layer","Fire Season Start Year","95th Percentile Rate of Growth (km^2 day^-1)"]],
        "fire_intensity": [13, ["Region Name","Regional Layer","Fire Season Start Year","Average Fire's 95th Percentile FRP (MW)"]],
}

def prepare_dataframe(inputfile, variable):
    """
    Read in a DataFrame and subset data.

    Parameters
    ----------
    inputfile : str
        Path to State of Wildfires database (.csv).
    variable : str
        Name of variable.
        One of six strings: ["burned","emissions","atlas","fire_growth","fire_size","fire_intensity"].

    Returns
    -------
    DataFrame.

    """
    # Get values for variable key
    values = variable_dict.get(variable)
    # print(values)

    # Read in data
    data = pd.read_csv(inputfile, skiprows=values[0])
    # print(data)

    # Subset columns
    columns = values[1]
    data = data[columns]

    # For burned area, keep only total land cover
    if variable == "burned":
        data = data[data["Land Cover"] == "Total"]
        data = data.round({"Burned Area (km^2)": 1})
    
    # For emissions, keep only multi-product mean and transform emission values
    if variable == "emissions":
        data = data[data["Product"] == "Multi_product_mean"]
        data["Carbon Emitted"] = (data["Carbon Emitted"] / 1e9) * 3.664
        data = data.round({"Carbon Emitted": 0})
    
    # For atlas, replace NaN number of fires with zero
    if variable == "atlas":
        data["Number of Fires"] = data["Number of Fires"].fillna(0)
    
    # For fire size, replace NaN number of fires with zero and round
    if variable == "fire_size":
        data["95th Percentile Fire Size (km^2)"] = data["95th Percentile Fire Size (km^2)"].fillna(0)
        data = data.round({"95th Percentile Fire Size (km^2)": 0})
    
    # For fire growth, replace NaN number of fires with zero and round
    if variable == "fire_growth":
        data["95th Percentile Rate of Growth (km^2 day^-1)"] = data["95th Percentile Rate of Growth (km^2 day^-1)"].fillna(0)
        data = data.round({"95th Percentile Rate of Growth (km^2 day^-1)": 0})
    
    # For fire intensity, replace NaN number of fires with zero and round
    if variable == "fire_intensity":
        data["Average Fire's 95th Percentile FRP (MW)"] = data["Average Fire's 95th Percentile FRP (MW)"].fillna(0)
        data = data.round({"Average Fire's 95th Percentile FRP (MW)": 0})

    # Return DataFrame
    # print(data)
    return(data)


def dataframe_to_json(df, variable, outputdir):
    """
    Convert a DataFrame to a JSON file.

    Parameters
    ----------
    inputfile : DataFrame
        pandas DataFrame (output from subset_columns()).
    variable : str
        Name of variable.
        One of six strings: ["burned","emissions","atlas","fire_growth","fire_size","fire_intensity"].
    outputdir : str
        Path to output directory.

    Returns
    -------
    None. Writes a JSON file.

    """
    # Get values for variable key
    values = variable_dict.get(variable)
    variable_name = values[1][-1]

    # Subset columns needed for json
    df = df.loc[:, ["Fire Season Start Year", variable_name, "Regional Layer", "Region Name"]]
    # print(df)

    # Create dictionary with layer names based on "Regional Layer" column
    regional_layers = {
        "Biomes": "Biomes",
        "Countries": "Countries",
        "Continents": "Continents",
        "Continental Biomes": "Continental_Biomes",
        "Ecoregions": "Ecoregions",
        "Global": "Global",
        "Global Fire Emissions Database Regions": "GFED_regions",
        "Hemispheres": "Hemispheres",
        "Hemispheres and Tropics": "NH-TR-SH",
        "IPCC Regions": "IPCC_WGI_regions",
        "RECCAP2 Regions": "RECCAP2_regions", 
        "States and Provinces": "GADM_UCDavis_L1",
    }

    # Create a nested dictionary containing data for each layer and region
    # E.g. { continents: {Europe: [{Year: 2010, Area: 100}, ...]}, Countries: {UK: [{}, ...]}, ... }
    data_nest = {}
    for key, layer in regional_layers.items():
        if layer in df["Regional Layer"].unique().tolist(): # only compute if layer is in variable dataset
            df_layer = df[df["Regional Layer"] == layer] # subset rows
            df_layer = df_layer[["Region Name", "Fire Season Start Year", variable_name]] # subset columns
            nested = {
                region: group.to_dict(orient="records")
                for region, group in df_layer.groupby("Region Name")
            }
            data_nest[key] = nested
    # print(data_nest.get("Countries").get("United Kingdom"))

    # Write dictionary to json file
    with open(f"{outputdir}/timeseries_{variable}.json", "w") as file:
        json.dump(data_nest, file, indent=1)
    

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Burned_Area_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "burned")
dataframe_to_json(df, "burned", outputdir)

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Carbon_Emissions_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "emissions")
dataframe_to_json(df, "emissions", outputdir)

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Global_Fire_Atlas_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "atlas")
dataframe_to_json(df, "atlas", outputdir)

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Global_Fire_Atlas_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "fire_size")
dataframe_to_json(df, "fire_size", outputdir)

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Global_Fire_Atlas_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "fire_growth")
dataframe_to_json(df, "fire_growth", outputdir)

file = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/data/State_of_Wildfires_2024-25_Fire_Intensity_annual_data_with_anomalies.csv"
outputdir = "/Users/tomjenkins/Projects/ClimateUEA/State_of_Wildfires/outputs"
df = prepare_dataframe(file, "fire_intensity")
dataframe_to_json(df, "fire_intensity", outputdir)