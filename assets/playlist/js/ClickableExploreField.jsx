import React from 'react';

export default class ClickableExploreField extends React.Component {
	constructor(props) {
		super(props);

		this.followLink = this.followLink.bind(this);
	}

	followLink() {
		window.location.href = `/explore/${this.props.field}/${this.props.id}/`;
	}

	render() {
		return (
			<span className="field-link" onClick={this.followLink}>
				{this.props.value}
			</span>
		)
	}
}