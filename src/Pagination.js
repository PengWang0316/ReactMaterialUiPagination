import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

/* istanbul ignore next */
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline'
  },
  button: {
    minWidth: 15
  },
  focusBtn: {
    minWidth: 15,
    color: theme.palette.secondary.main,
    fontWeight: 'bold'
  }
});

const TOTAL_SHOWING_NUMBER = 9; // The total amount page number will be showed.

/**
 * A React component to show the pagination. It uses Material-UI library (Version >= 1.2.0).
 * Author: Kevin W.
 */
export class Pagination extends Component {
  /**
   * Calculating the current page number based on the offset and limitation number.
   * Puls one to prevent 0 offset.
   * @param {number} offset is the number will be skipped.
   * @param {number} limit is how many item will show in one page.
   * @return {number} Return a number that represents the current page number.
   */
  static calculateCurrentPage = (offset, limit) => Math.floor((offset / limit) + 1);

  static propTypes = {
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  /**
   * Calulating the total page number and setting up the currentPage state.
   * @param {object} props contains component's props values
   * @return {null} No return
   */
  constructor(props) {
    super(props);
    const { offset, limit, total } = props;
    this.totalPageNumber = Math.ceil(total / limit); // The total amount pages a user has.
    this.currentPage = Pagination.calculateCurrentPage(offset, limit);
    let buttons;
    if (this.totalPageNumber <= TOTAL_SHOWING_NUMBER) { // If the total page equal or less than showing number, show all page number without any ellipsis.
      this.isShowAllNumber = true; // Setting up a indicator for two different showing methods.
      buttons = this.assembleAllButtons(this.currentPage);
    } else buttons = this.assembleButtons(this.currentPage); // If the total page number greater than the showing number, the ellipsis will be showed based on the current page.

    this.state = { buttons };
  }

  /**
   * Creating a Button element.
   * @param {string} className is the button's style class name.
   * @param {functon} onClick is a function that will be run when a user click the button.
   * @param {number} number is the page number.
   * @return {object} Return a Button element.
   */
  static getButton = (className, onClick, number) => <Button classes={{ root: className }} onClick={onClick} key={number} color="primary">{number}</Button>;

  /**
   * Returning a Button component.
   * @param {boolean} isDisable is an indicator of whether this is the first page.
   * @param {string} text is the content will be showed in the button.
   * @param {function} onClick is the function will be called when a user clicks the button.
   * @param {string} className is the class name for the component.
   * @return {Object} Button is a Material-UI Button component.
   */
  static getArrowButton = (isDisable, text, onClick, className) => <Button disabled={isDisable} color="primary" onClick={onClick} className={className} key={text}>{text}</Button>;

  /**
   * Calling the handlePageChange function with a increased page number.
   * @return {null} No return.
   */
  handleForwardClick = () => this.handlePageChange(this.currentPage + 1);

  /**
   * Calling the handlePageChange function with a decreased page number.
   * @return {null} No return.
   */
  handleBackwardClick = () => this.handlePageChange(this.currentPage - 1);

  /**
   * Setting the current page to the new number, reassembling the buttons and call the onClick function with the new offset.
   * @param {number} pageNumber is the page number a user wants to go.
   * @return {null} No return.
   */
  handlePageChange = pageNumber => {
    if (pageNumber !== this.currentPage) { // Just run the code when a different page number was clicked.
      const { onClick, limit } = this.props;
      this.currentPage = pageNumber;
      onClick((this.currentPage - 1) * limit); // Sending back the offset number.
      if (!this.isShowAllNumber) // If the page number more than showing number, the buttons need to be recalculated
        return this.setState({ buttons: this.assembleButtons(this.currentPage) });
      return this.setState({ buttons: this.assembleAllButtons(this.currentPage) }); // If the page number does not more than showing number, assembling all page number button.
    }
    return null;
  };

  /**
   * When a user clicks a button, set currentPage state and recalculate the button element if necessary.
   * @param {object} event comes from the element the user clicked. It could be the button or the span element inside of the button.
   * @return {null} No return.
   */
  handleClick = event => {
    event.preventDefault(); // Stopping event bubbling
    // If the target has two child nodes, it is the button. If it has one child node, it is the span element.
    const pageNumber = event.target.childNodes.length === 2 ? event.target.childNodes[0].innerText : event.target.innerText;
    this.handlePageChange(pageNumber * 1);
  };

  /**
   * Assebling all page number button based on total page number and current page number.
   * @param {number} currentPage is the current page number.
   * @return {array} Return a buttons element array.
   */
  assembleAllButtons(currentPage) {
    const { classes } = this.props;
    const buttons = [Pagination.getArrowButton(currentPage === 1, '<', this.handleBackwardClick, classes.button)]; // Added the forward button to the array.
    for (let i = 0; i < this.totalPageNumber; i++)
      buttons.push(Pagination.getButton(i + 1 === currentPage ? classes.focusBtn : classes.button, this.handleClick, i + 1));
    buttons.push(Pagination.getArrowButton(currentPage === this.totalPageNumber, '>', this.handleForwardClick, classes.button));
    return buttons;
  }

  /**
   * Assembling a button array with the ellipsis based on the current page number.
   * @param {number} currentPage is the current page number.
   * @return {array} Return a button array with the ellipsis.
   */
  assembleButtons(currentPage) {
    const { classes } = this.props;
    const middleButtons = [];
    const leftButtons = [];
    const rightButtons = [];

    // Push the current page to the middle button array.
    middleButtons.push(Pagination.getButton(classes.focusBtn, this.handleClick, currentPage));
    if (currentPage !== this.totalPageNumber) // If the current page is not the last page, push one more page follow the current page to the middle button array.
      middleButtons.push(Pagination.getButton(classes.button, this.handleClick, currentPage + 1));
    if (currentPage !== 1) // If the current page is not the first page, unshift one more page ahead the current page to the middle button array.
      middleButtons.unshift(Pagination.getButton(classes.button, this.handleClick, currentPage - 1));

    // Putting first two and last two page numbers to left and right button arrays.
    if (middleButtons[0].key * 1 !== 1) { // If the first number in the middle button array is not one, push one to the left button array.
      leftButtons.push(Pagination.getButton(classes.button, this.handleClick, 1));
      if (middleButtons[0].key * 1 !== 2)
        leftButtons.push(Pagination.getButton(classes.button, this.handleClick, 2));
    }

    // Putting the last two page numbers to the right button array.
    if (middleButtons[middleButtons.length - 1].key * 1 !== this.totalPageNumber) {
      rightButtons.push(Pagination.getButton(classes.button, this.handleClick, this.totalPageNumber));
      if (middleButtons[middleButtons.length - 1].key * 1 !== this.totalPageNumber - 1)
        rightButtons.unshift(Pagination.getButton(classes.button, this.handleClick, this.totalPageNumber - 1));
    }

    // Calculating how many remaining space still has.
    const remainingSpace = TOTAL_SHOWING_NUMBER - (leftButtons.length + middleButtons.length + rightButtons.length);

    // Trying to put more page numbers to the left first.
    if (leftButtons.length === 2 && (middleButtons[0].key * 1) - (leftButtons[1].key * 1) >= remainingSpace) { // If the distance between the last leftButton number and the first middleButton number equal or greater than remaining space, put more number to the leftButtons array.
      for (let i = (leftButtons[1].key * 1) + 1; i < remainingSpace + (leftButtons[1].key * 1) + 1; i++)
        if (i !== middleButtons[0].key * 1) leftButtons.push(Pagination.getButton(classes.button, this.handleClick, i));
    }/* istanbul ignore next */ else if (rightButtons.length === 2 && ((rightButtons[0].key) * 1) - (middleButtons[middleButtons.length - 1].key * 1) >= remainingSpace) { // Trying to put more number to middleButton array
      const startNumber = (middleButtons[middleButtons.length - 1].key * 1) + 1;
      for (let i = startNumber; i < remainingSpace + startNumber; i++)
        /* istanbul ignore next */
        if (i !== rightButtons[0].key * 1) middleButtons.push(Pagination.getButton(classes.button, this.handleClick, i));
    }

    // Adding the ellipsis to the middle button array
    if (leftButtons[0] && (middleButtons[0].key * 1) - 1 !== leftButtons[leftButtons.length - 1].key * 1)
      middleButtons.unshift(<Typography color="textSecondary" key="leftEllipsis">...</Typography>);
    if (rightButtons[0] && (middleButtons[middleButtons.length - 1].key * 1) + 1 !== rightButtons[0].key * 1)
      middleButtons.push(<Typography color="textSecondary" key="rightEllipsis">...</Typography>);

    // Adding the forward and backward buttons.
    leftButtons.unshift(Pagination.getArrowButton(currentPage === 1, '<', this.handleBackwardClick, this.props.classes.button));
    rightButtons.push(Pagination.getArrowButton(currentPage === this.totalPageNumber, '>', this.handleForwardClick, this.props.classes.button));

    return [...leftButtons, ...middleButtons, ...rightButtons];
  }

  /**
   * The render method.
   * @return {jsx} Return the jsx for the component.
   */
  render() {
    const { classes } = this.props;
    const { buttons } = this.state;
    return (
      <div className={classes.root}>
        {buttons}
      </div>
    );
  }
}
export default withStyles(styles)(Pagination);
// module.exports = withStyles(styles)(Pagination);
