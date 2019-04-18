import React from "react";
import { Col, Row, Grid } from "react-native-easy-grid";

export default class RestrictionGrid extends React.Component {
  render() {
    let data = this.props.data;
    if (!data || data.constructor !== Array) {
      // console.error("Restriction Grid Prop 'data' must be of type Array");
    }
    let colPattern = this.props.colPattern;
    if (!colPattern || colPattern.constructor !== Array) {
      // console.error("Restriction Grid Prop 'data' must be of type Array");
    }
    //Check if renderItem exists as a prop
    let renderItem = this.props.renderItem;
    if (!renderItem || renderItem.constructor !== Function) {
      // console.error(
      //   "Restriction Grid Prop 'renderItem' must be of type Function"
      // );
    }

    let colPatternIndex = 0,
      num = 0;
    let cols = [],
      rows = [];

    for (let i = 0; i < data.length; i++) {
      cols.push(<Col key={i}>{renderItem(data[i], i)}</Col>);
      num++;
      if (num == colPattern[colPatternIndex]) {
        num = 0;
        colPatternIndex++;
        colPatternIndex %= colPattern.length;
        rows.push(<Row key={i}>{cols}</Row>);
        cols = [];
      } else if (i == data.length - 1) {
        rows.push(<Row key={i}>{cols}</Row>);
      }
    }
    return <Grid>{rows}</Grid>;
  }
}
