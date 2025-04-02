import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const JobTitle = styled.h3`
  font-size: 18px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 5px;
`;

const JobCompany = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const JobMatch = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 14px;
`;

const JobDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
`;

const JobDetail = styled.div`
  margin-right: 15px;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${props => props.theme.colors.darkGray};
`;

const SkillsContainer = styled.div`
  margin-top: 10px;
`;

const SkillTag = styled.span`
  display: inline-block;
  background-color: ${props => props.matched ? props.theme.colors.primary : props.theme.colors.lightBlue};
  color: ${props => props.matched ? props.theme.colors.white : props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 3px 8px;
  margin: 2px;
  border-radius: 15px;
  font-size: 13px;
`;

const JobLink = styled.a`
  display: inline-block;
  margin-top: 10px;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

const JobCard = ({ job }) => {
  const { 
    title, 
    company, 
    location, 
    experienceRequired, 
    skills, 
    salary, 
    matchScore, 
    matchedSkills, 
    url 
  } = job;

  return (
    <Card>
      <JobMatch>{matchScore}% 일치</JobMatch>
      <JobTitle>{title}</JobTitle>
      <JobCompany>{company}</JobCompany>
      <JobDetails>
        <JobDetail>{location}</JobDetail>
        <JobDetail>{experienceRequired}</JobDetail>
        <JobDetail>{salary}</JobDetail>
      </JobDetails>
      <SkillsContainer>
        {skills.map((skill, index) => (
          <SkillTag 
            key={index} 
            matched={matchedSkills.includes(skill)}
          >
            {skill}
          </SkillTag>
        ))}
      </SkillsContainer>
      <JobLink href={url} target="_blank" rel="noopener noreferrer">
        채용공고 보기
      </JobLink>
    </Card>
  );
};

export default JobCard;