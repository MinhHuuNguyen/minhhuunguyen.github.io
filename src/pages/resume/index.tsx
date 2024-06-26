import React from 'react';
import styles from '../../styles/Resume.module.css'; // adjust the path according to your project structure
import data from '../../utils/data/json/resume.json';
import { useEffect, useState } from 'react';
import style from '../../styles/ResumeProject.module.css';


interface JobTitle {
  name: string;
  titles: string[];
}

interface ImgArea {
  imgSrc: string;
}

interface Social {
  linkedin: string;
  email: string;
  phone: string;
  location: string;
}

interface Header {
  jobTitle: JobTitle;
  imgArea: ImgArea;
  social: Social;
}

interface Detail {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: string;
  details: string[];
}

interface Education {
  degree: string;
  field: string;
  school: string;
  duration: string;
}

interface ResumeProjectProps {
  projectName: string;
  projectYear: number;
  overall: string;
  domain: string;
  techStack: string[];
}

interface Resume {
  header: Header;

  main: {
    left: {
      Experience: Detail[];
    };
    right: {
      Education: Education[];
      Language: string;
      Award: string[];
      Skill: string[];
    };
  };
}

const Resume = () => {
  return (
    <div id="resume">
      <div className={styles.container}>
        <div className={styles.header}>
          <section className={styles.jobTitle}>
            <h2>{data.header.jobTitle.name}</h2>
            {data.header.jobTitle.titles.map((title, index) => (
              <h3 key={index}>{title}</h3>
            ))}
          </section>

          <section className={styles.imgArea}>
            <img src={data.header.imgArea.imgSrc} alt="" />
          </section>

          <section className={styles.social}>
            <p>{data.header.social.linkedin}<i className="fa-brands fa-linkedin-in"></i></p>
            <p>{data.header.social.email}<i className="fa fa-envelope" aria-hidden="true"></i></p>
            <p>{data.header.social.phone}<i className="fa fa-phone"></i></p>
            <p>{data.header.social.location}<i className="fa fa-map-marker" aria-hidden="true"></i></p>
          </section>
        </div>

        <div className={styles.main}>
          <div className={styles.left}>
            <h2>Experience</h2>
            {data.main.left.Experience.map((job, index) => {
              const startDate = new Date(job.startDate);
              let endDate = new Date(); // Default to current date

              if (job.endDate !== 'Present') {
                endDate = new Date(job.endDate);
              }

              const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
              const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
              const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30));

              const yearString = diffYears > 1 ? `${diffYears} years` : diffYears === 1 ? `${diffYears} year` : '';
              const monthString = diffMonths > 1 ? `${diffMonths} months` : diffMonths === 1 ? `${diffMonths} month` : '';

              const duration = [yearString, monthString].filter(Boolean).join(', ');

              return (
                <div key={index}>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <p>{job.startDate} - {job.endDate} ({duration})</p>
                  <ul>
                    {job.details.map((detail, i) => (
                      <li key={i}>
                        <a href={`#project-${i + 1}`}>{detail}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className={styles.right}>
            <h2>Education</h2>
            {data.main.right.Education.map((education, index) => (
              <div key={index}>
                <h3>{education.degree}</h3>
                <p>{education.field}</p>
                <p>{education.school}</p>
                <p>{education.duration}</p>
              </div>
            ))}
            <h3>Language</h3>
            <p>{data.main.right.Language}</p>
            <h2>Award</h2>
            <ul>
              {data.main.right.Award.map((award, index) => (
                <li key={index}>{award}</li>
              ))}
            </ul>
            <h2>Skill</h2>
            <ul className={styles.skill}>
              {data.main.right.Skill.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className={style.container} >
        <h1>Project Detail</h1>
        {data.project.job.map((job, jobIndex) => (
          <div key={jobIndex}>
            <h2>{job.info.service}</h2>
            <p>{job.info.company} ({job.info.startDate} - {job.info.endDate})</p>
            {job.details.map((project, projectIndex) => (
              <div key={projectIndex}>
                <div className={style.project}>
                  <h4 id={`project-${projectIndex + 1}`}>{projectIndex + 1}. {project.projectName} ({project.projectYear})</h4>
                  <ul>
                    <li>Overall: {project.overall}</li>
                    <li>Domain: {project.domain}</li>
                    <li>Techstack: {project.techStack.join(", ")}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

  );
};

export default Resume;