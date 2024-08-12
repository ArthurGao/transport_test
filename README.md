# Mobility Lab Technical Test

## Introduction

Welcome to the Mobility Lab technical test. This test is designed to evaluate your skills in front end development, data processing and transformation.

In this test you will work with a JSON file `test_input.json` containing features with various attributes, including coordinates, speed, datetime and level of service (los_band).

## Instructions

Your task will be to develop data processing functions and develop GUI elements to interact with the time-varying data. The following is required:

- Create a dynamic range slider at the intervals contained within the datetime attribute of the dataset.
- Tied to the range slider are four options:
  1. Value
  2. Mean
  3. Maximum
  4. Minimum
- The `value` option would have a single slider and would render data associated with that datetime in the data. The remaining options (`mean`, `maximum`, `minimum`) would have a two point range slider (lower and upper timestamp values).
- A function should be written to undertake the data processing based on the range slider values. E.g., with `mean` selected, calculate the mean speed between (inclusive) the upper and lower values of the range slider.
- The slider should have the functionality to play and pause, to create an animation.
- A base example using the file `test_input_example.json` has been provided. This dataset does not contain time-varying values.

## Data

The data consists:

- coordinates: an array of latitude and longitude points, connected up to create a line
- datetime: the data point timestamps
- speed: the timestamp's speed data values
- los_band: the level of service data values
- id: unique identifier for each road section

### Usage

Copy the content of this folder to your project.

```bash
# install dependencies
yarn
# bundle and serve the app
yarn start
```
