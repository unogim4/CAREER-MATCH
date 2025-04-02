import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.gray};
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 5px;
  border: 1px solid transparent;
  border-radius: 5px 5px 0 0;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  border-color: ${props => props.active ? props.theme.colors.gray : 'transparent'};
  border-bottom-color: ${props => props.active ? 'white' : 'transparent'};
  margin-bottom: ${props => props.active ? '-1px' : '0'};
  color: ${props => props.active ? props.theme.colors.primary : 'inherit'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const TabPanel = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabsContainer>
        {tabs.map((tab, index) => (
          <Tab 
            key={index} 
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>
      {tabs.map((tab, index) => (
        <TabContent key={index} active={activeTab === index}>
          {tab.content}
        </TabContent>
      ))}
    </>
  );
};

export default TabPanel;