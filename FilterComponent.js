import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Align filter component and text to left and right respectively */
  align-items: center; /* Vertically align text and filter component */
  margin-bottom: 16px; /* Optional: Add margin for spacing */
  padding-right: 10px;
  padding-top: 5px;
`;

const TextStyled = styled.div`
  width: 112px;
  height: 25px;
  color: #000000;
  display: flex;
  align-items: center; /* Vertically align text within the box */

  /* Text styles */
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0.009px;
  text-align: left;
  padding-left: 8px; /* Add left padding for spacing */
`;

const InputStyled = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 32px;
  width: 160px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <FilterContainer>
    <InputStyled
      id="search"
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={onFilter}
    />
  </FilterContainer>
);

export default FilterComponent;
