import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { Pagination } from '../src/Pagination';

jest.mock('@material-ui/core/Button', () => 'Button');

describe('Pagination', () => {
  const defaultProps = {
    classes: {
      root: 'root',
      button: 'button',
      focusBtn: 'focusBtn'
    },
    offset: 0,
    total: 100,
    limit: 6,
    onClick: jest.fn()
  };
  const getShallowComponent = (props = defaultProps) => shallow(<Pagination {...props} />);

  test('Constructor and state', () => {
    let component = getShallowComponent();
    expect(component.instance().totalPageNumber).toBe(17);
    expect(component.instance().currentPage).toBe(1);
    expect(component.instance().isShowAllNumber).toBeFalsy();
    expect(component.state('buttons').length).toBe(12);

    component = getShallowComponent({ ...defaultProps, total: 40, offset: 7 });
    expect(component.instance().totalPageNumber).toBe(7);
    expect(component.instance().currentPage).toBe(2);
    expect(component.instance().isShowAllNumber).toBe(true);
    expect(component.state('buttons').length).toBe(9);
  });

  test('getButton', () => {
    const className = 'className';
    const onClick = jest.fn();
    const number = 1;
    expect(Pagination.getButton(className, onClick, number)).toEqual(<Button classes={{ root: className }} onClick={onClick} key={number} color="primary">{number}</Button>);
  });

  test('getArrowButton', () => {
    const isDisable = true;
    const text = 'text';
    const onClick = jest.fn();
    const className = 'className';
    expect(Pagination.getArrowButton(isDisable, text, onClick, className))
      .toEqual(<Button disabled={isDisable} color="primary" onClick={onClick} className={className} key={text}>{text}</Button>);
  });

  test('handleForwardClick', () => {
    const component = getShallowComponent();
    const mockHandlePageChange = jest.fn();
    component.instance().handlePageChange = mockHandlePageChange;
    component.instance().handleForwardClick();
    expect(mockHandlePageChange).toHaveBeenCalledTimes(1);
    expect(mockHandlePageChange).toHaveBeenLastCalledWith(2);
  });

  test('handleBackwardClick', () => {
    const component = getShallowComponent();
    const mockHandlePageChange = jest.fn();
    component.instance().handlePageChange = mockHandlePageChange;
    component.instance().handleBackwardClick();
    expect(mockHandlePageChange).toHaveBeenCalledTimes(1);
    expect(mockHandlePageChange).toHaveBeenLastCalledWith(0);
  });

  test('handlePageChange', () => {
    const mockAssembleButtons = jest.fn().mockReturnValue('AssembleButtons');
    const mockAssembleAllButtons = jest.fn().mockReturnValue('AssembleAllButtons');
    const component = getShallowComponent();
    component.instance().assembleButtons = mockAssembleButtons;
    component.instance().assembleAllButtons = mockAssembleAllButtons;
    component.instance().handlePageChange(1);
    expect(defaultProps.onClick).not.toHaveBeenCalled();

    component.instance().handlePageChange(10);
    expect(mockAssembleButtons).toHaveBeenCalledTimes(1);
    expect(mockAssembleButtons).toHaveBeenLastCalledWith(10);
    expect(component.state('buttons')).toBe('AssembleButtons');
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClick).toHaveBeenLastCalledWith(54);

    component.instance().isShowAllNumber = true;
    component.instance().handlePageChange(11);
    expect(mockAssembleAllButtons).toHaveBeenCalledTimes(1);
    expect(mockAssembleAllButtons).toHaveBeenLastCalledWith(11);
    expect(component.state('buttons')).toBe('AssembleAllButtons');
    expect(defaultProps.onClick).toHaveBeenCalledTimes(2);
    expect(defaultProps.onClick).toHaveBeenLastCalledWith(60);
  });

  test('handleClick', () => {
    const component = getShallowComponent();
    const mockPreventDefault = jest.fn();
    const mockHandlePageChange = jest.fn();
    const event = { preventDefault: mockPreventDefault, target: { childNodes: [], innerText: '2' } };
    component.instance().handlePageChange = mockHandlePageChange;

    component.instance().handleClick(event);
    expect(mockHandlePageChange).toHaveBeenCalledTimes(1);
    expect(mockHandlePageChange).toHaveBeenLastCalledWith(2);

    event.target.childNodes = [{ innerText: '3' }, {}];
    component.instance().handleClick(event);
    expect(mockHandlePageChange).toHaveBeenCalledTimes(2);
    expect(mockHandlePageChange).toHaveBeenLastCalledWith(3);
  });

  test('assembleAllButtons', () => {
    const component = getShallowComponent();
    component.instance().totalPageNumber = 5;

    const returnButtons = component.instance().assembleAllButtons(1);
    expect(returnButtons.length).toBe(7);
  });

  test('assembleButtons', () => {
    const component = getShallowComponent();
    let returnButtons = component.instance().assembleButtons(1);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(2);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(3);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(5);
    expect(returnButtons.length).toBe(11);

    returnButtons = component.instance().assembleButtons(8);
    expect(returnButtons.length).toBe(13);

    returnButtons = component.instance().assembleButtons(14);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(15);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(16);
    expect(returnButtons.length).toBe(12);

    returnButtons = component.instance().assembleButtons(17);
    expect(returnButtons.length).toBe(12);
  });

  test('snapshot', () => expect(renderer.create(<Pagination {...defaultProps} />).toJSON()).toMatchSnapshot());
});
