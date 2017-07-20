
import React, { Component } from 'react';
import nasaLogo from './nasa-logo-1500x1200.png';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      roverChosen: "curiosity",
      cameraChosen: "",
      firstResponsePhoto: null,
      error: "",
      loading: "",
      initialRequestMade: false
    };
  }

  // when user selects a rover, update state
  handleRoverSelection = (event) => {
    this.setState({
      roverChosen: event.target.value,
      cameraChosen: ""
    });
  }

  // when user selects a camera, update state
  handleCameraSelection = (event) => {
    this.setState({ cameraChosen: event.target.value });
  }

  // when user hits "Go"
  handleSubmit = (event) => {

    // when user clicks submit, check if photo url is empty
    // if so, set state of loading

    this.setState({
      loading: "Loading...",
    });


    let baseUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.state.roverChosen}/photos?sol=100&camera=${this.state.cameraChosen}&api_key=Tv6gAKvEQVPyIf0KwDIHRQXRuJ17XQYIEETD2e35`;

    axios.get(baseUrl)
    .then((res) => {
      if (res.data.Error) { // if error
        this.setState({
          error: res.errors
        });
      } else { // if success
        let photoVal = "";

        // check if any photos come back
        if (!!res.data.photos[0]) {
          photoVal = res.data.photos[0].img_src;
        } else {
          photoVal = null;
        }

        // regardless of if photos come back:
        this.setState({
          firstResponsePhoto: photoVal,
          loading: "",
          initialRequestMade: true
        });
      }
    });
  }

  // sometimes the rover doesn't have pics for that cam
  renderPhotoOrWhale() {
    // display the fail whale only if no pics returns; NOT on initial pg load
    if (!this.state.firstResponsePhoto && this.state.initialRequestMade) {
      return (
        <div>
          <p>No photos found!</p>
          <img alt="none found" src={'http://www.yiyinglu.com/wp-content/uploads/2013/11/lifting-a-dreamer-2009.jpg'}/>;
        </div>
      );
    } else { // otherwise, display the photo
      return <img alt="" src={this.state.firstResponsePhoto}/>;
    }
  }

  // what should we render to the DOM?
  render() {

    let roverCameras = {
      "spirit": [
        {
          abbrev: "NAVCAM",
          name:	"Navigation Camera"
        },
        {
          abbrev: "PANCAM",
          name:	"Panoramic Camera"
        }
      ],
      "curiosity": [
        {
          abbrev: "FHAZ",
          name: "Front Hazard Avoidance Camera"
        },
        {
          abbrev: "RHAZ",
          name:	"Rear Hazard Avoidance Camera"
        },
        {
          abbrev: "MAST",
          name:	"Mast Camera"
        },
        {
          abbrev: "CHEMCAM",
          name:	"Chemistry and Camera Complex"
        },
        {
          abbrev: "NAVCAM",
          name:	"Navigation Camera"
        },
      ],
      "opportunity": [
        {
          abbrev: "NAVCAM",
          name:	"Navigation Camera"
        },
        {
          abbrev: "PANCAM",
          name:	"Panoramic Camera"
        }
      ]
    }

    return (
      <div className="App">

        <div className="App-header-container">
          <div className="App-header">
            <img src={nasaLogo} className="App-logo" alt="logo" />
          </div>
          <p className="App-intro">
            <h1>Mars Rover Cameras</h1>
          </p>
          <span>Data provided by NASA.</span><br />
          <span>Each photo was taken on the rover's 100th sol (day) on Mars.</span><br /><br />
          <span>Dates active on Mars:</span><br />
          <span>Spirit: 2004-2010</span><br />
          <span>Opportunity: 2004 - present</span><br />
          <span>Curiosity: 2012 - present</span><br />
        </div><br /><br />

        <div>
        <label>Choose a Mars rover:
          <br />
          <select value={this.state.roverChosen} onChange={this.handleRoverSelection}>
            <option value="curiosity">Curiosity</option>
            <option value="spirit">Spirit</option>
            <option value="opportunity">Opportunity</option>
          </select>
        </label>
        </div>

        <br /><br />

        <label>Choose a camera:
          <br />
          <select value={this.state.cameraChosen} onChange={this.handleCameraSelection}>
            <option value={''}>Cameras:</option>
            {roverCameras[this.state.roverChosen].map((cameraObj) =>
              <option key={cameraObj.abbrev} value={cameraObj.abbrev}>{cameraObj.name}</option>
            )}
          </select>
        </label>

        <br /><br />

        <button onClick={this.handleSubmit}>GO!</button>

        <br /><br />

        <p>{this.state.loading}</p>

        {this.renderPhotoOrWhale()}

      </div>
    );
  }
}

export default App;
