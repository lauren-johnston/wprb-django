import React from 'react';
import ReactDOM from 'react-dom';

import debounce from 'debounce';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

/* A search bar component to search for songs, artists, albums, djs,
    shows, and labels. Uses the react-select-plus component*/

export default class Search extends React.Component {
    constructor (props) {
        super(props)
        /* The category display orders in the search bar */
        this.displayOrder = ['songs', 'artists', 'albums', 'djs', 'shows', 'labels'];
        this.state = {
            query: '', // the string in the search bar
            options: [],
            redirect: false
        };
        this.makeQuery = this.makeQuery.bind(this);
        this.explore = this.explore.bind(this);
  }

  /* send an ajax request to the search api to get results */
  makeQuery(query) {
      // don't search on empty query
      this.state.query = query
      if (query.length < 1) {
          this.setState({
              query: query,
              options: [],
              redirect: false
          })
          return;
      }

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
          // superresults contains the headers (songs, albums), and nests
          // respective results in each header */
          let superresults = [];

          for (let i = 0; i < this.displayOrder.length; i++) {

              let results = [];
              let category = this.displayOrder[i]

              /* only display upperBound results; arbitrary choice */
              let upperBound = 4;
              if (data[category].length < upperBound) {
                  upperBound = data[category].length;
              }


              for (let j = 0; j < upperBound; j++) {
                  /* create options for each header */
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

          // save superresults into state
          this.setState({
              query: query,
              options: superresults,
              redirect: false
          });
      });
  }

  /* if user clicks on an option in teh dropdown, direct them to the correct
    explore page */
  explore(selection) {

      let category = selection.selectValue.category;
      /* HACK: categories may be "songs" but we want "song" singular when
        we are creating the redirect url */
      category = category.substring(0, category.length-1);
      let id = selection.selectValue.value.substring(category.length+1);
      /* remember, theres no actual show explore page */
      if (category === "show") {
          category = "dj";
      }
      window.location.href = `/explore/${category}/${id}/`;
  }

  render () {

      return (
          <div id="search-bar" >
              <Select
                  options={this.state.options}
                  onChange={(selectValue) => this.explore({selectValue})}
                  onInputChange={debounce((selectValue) => this.makeQuery(selectValue), 100)}
                  valueKey={this.state.selectValue}
                  noResultsText = {this.state.query == "" ? "" : "No results"}
                  placeholder="Search songs, artists, djs, shows, labels" />
          </div>
      );
    }
}
