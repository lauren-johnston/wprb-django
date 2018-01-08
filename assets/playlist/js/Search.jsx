import React from 'react';
import ReactDOM from 'react-dom';
//import Select from 'react-select';

//import Select from 'react-virtualized-select'
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
//import 'react-select/dist/react-select.css';
//import 'react-virtualized/styles.css';
//import 'react-virtualized-select/styles.css';

export default class Search extends React.Component {
    constructor (props) {
        super(props)
        this.displayOrder = ['songs', 'artists', 'albums', 'djs', 'shows', 'labels'];
        this.state = {
            query: '',
            options: [],
            redirect: false
        };
        this.makeQuery = this.makeQuery.bind(this);
        this.explore = this.explore.bind(this);
  }

  makeQuery(query) {
      // don't search on empty query
      this.state.query = query
      if (query.length < 1) {
          this.setState({
              query: query,
              options: [],
              redirect: false
          })
          return;}

      // make ajax request
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
          let superresults = [];

          for (let i = 0; i < this.displayOrder.length; i++) {

              let results = [];
              let category = this.displayOrder[i]
              let upperBound = 3;
              if (data[category].length < 3) {
                  upperBound = data[category].length;
              }

              for (let j = 0; j < upperBound; j++) {
                  results.push({
                      label: data[category][j]['name'],
                      value: category + data[category][j]['id'],
                      category: category}
                      );
              }
              superresults.push({label: category,
                                value: category,
                                options: results})
          }

          //console.log(superresults)
          this.setState({
              query: query,
              options: superresults,
              redirect: false
          });
      });
  }

  explore(selection) {

      let category = selection.selectValue.category;
      category = category.substring(0, category.length-1);
      let id = selection.selectValue.value.substring(category.length+1);
      if (category === "show") {
          category = "dj";
      }
      window.location.href = `/explore/${category}/${id}/`;
  }

  render () {

      //value={this.state.selectValue}

      return (
          <div id="search-bar" >
              <Select
                  options={this.state.options}
                  onChange={(selectValue) => this.explore({selectValue})}
                  onInputChange={(selectValue) => {this.makeQuery(selectValue)}}
                  valueKey={this.state.selectValue}

                  noResultsText = {this.state.query == "" ? "" : "No results"}
                  placeholder="Search songs, artists, djs, shows, labels" />
          </div>
      );
    }
}
