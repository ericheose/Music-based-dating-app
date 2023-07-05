import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
    appearance: none;
    width: 20px;
    height: 20px;
    margin-right: 1rem;
    background-color: #f5f5f5;
    border-radius: 5px;
    border: none;
    outline: none;
    cursor: pointer;

    &:checked {
        background-color: #f1c057;
    }
`;

const Label = styled.label`
    font-size: 1rem;
    font-weight: 400;
    color: #1c1c1c;
`;


const KeepLoggedInCheckbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Container>
      <Checkbox
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        id="keepLoggedIn"
        name="keepLoggedIn"
      />
      <Label htmlFor="keepLoggedIn">Keep me logged in</Label>
    </Container>
  );
};

export default KeepLoggedInCheckbox;
