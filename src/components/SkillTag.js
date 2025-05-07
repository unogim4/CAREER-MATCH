import React from 'react';
import styled from 'styled-components';

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
`;

const Tag = styled.div`
  background-color: ${props => props.theme.colors.lightBlue};
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  margin: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
`;

const RemoveButton = styled.span`
  margin-left: 5px;
  cursor: pointer;
  color: ${props => props.theme.colors.darkGray};
  font-weight: bold;
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

const SkillTag = ({ skill, onRemove }) => {
  return (
    <Tag>
      {skill}
      <RemoveButton onClick={() => onRemove(skill)}>&times;</RemoveButton>
    </Tag>
  );
};

export const SkillTagContainer = ({ children }) => {
  return <TagContainer>{children}</TagContainer>;
};

export default SkillTag;