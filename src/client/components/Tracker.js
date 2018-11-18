import React, { Component, } from 'react';
import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-128111333-1');

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.trackPage = this.trackPage.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line
    const page = this.props.location.pathname + this.props.location.search;
    this.trackPage(page);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const currentPage = prevProps.location.pathname + prevProps.location.search;
    const nextPage = location.pathname + location.search;

    if (currentPage !== nextPage) {
      this.trackPage(nextPage);
    }
  }

  trackPage(page) {
    const { options } = this.props;
    GoogleAnalytics.set({
      page,
      ...options,
    });
    GoogleAnalytics.pageview(page);
  }

  render() {
    return <div />;
  }
}

export default Tracker;
