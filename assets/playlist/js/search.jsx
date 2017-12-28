import React from 'react';
import ReactDOM from 'react-dom';
import ClickableExploreField from './ClickableExploreField.jsx';
import VirtualizedSelect from 'react-virtualized-select';
//import Select from 'react-select';
import Select from 'react-virtualized-select';
/*
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css'; */



class MySelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const options = [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
      { label: "Three", value: 3, disabled: true }
      // And so on...
    ]

    return (
      <VirtualizedSelect
        options={options}
        onChange={(selectValue) => this.setState({ selectValue })}
        value={this.state.selectValue}
      />
    )
  }
}




class Search extends React.Component {
	constructor(props) {
		super(props);
		//this.makeQuery = this.makeQuery.bind(this);

		this.state = {query: '',
			results: null,
			songs: [],
			artists: [],
			albums: [],
			djs: [],
			labels: [],
			shows: []};
		this.makeQuery = this.makeQuery.bind(this);
	}
	makeQuery() {
		let query = document.getElementById("search-bar").value
		fetch('/playlist/search/?query=' + query, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			this.setState({
				results: JSON.stringify(data)
				})
			console.log(data);
		});

	}


	render() {
		//let results;
		//if (this.state.results) results = <SearchResults results={this.state.results} />;
		//else results = null;

		return (
			<div className="search">
				<input id="search-bar" type="text" name="search-input" onKeyUp={this.makeQuery} />
				<div className="search-results">
					<p>{this.state.results}</p>

				</div>

			</div>
		);
	}
}

class SearchResults extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return null;
	}
}

ReactDOM.render(
    React.createElement(MySelect, window.props),
    window.react_mount,
);
