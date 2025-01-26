import React from 'react';
import Image from 'next/image';

import data from '../../utils/data/resume.json';
import resumeStyle from '../../styles/Resume.module.css';
import resumeProjectStyle from '../../styles/ResumeProject.module.css';

const Resume = () => {
  return (
    <div>
      <div className={resumeStyle.container} id="resume">
        <div className={resumeStyle.header}>
          <section className={resumeStyle.jobTitle}>
            <h2>{data.personal.name}</h2>
            {data.personal.title.map((title, index) => (
              <h3 key={index}>{title}</h3>
            ))}
          </section>

          <section className={resumeStyle.imgArea}>
            <Image src={data.personal.avatar} alt="" width={200} height={200} />
          </section>

          <section className={resumeStyle.social}>
            <p>{data.personal.social.linkedin}<i className="fa-brands fa-linkedin-in"></i></p>
            <p>{data.personal.social.email}<i className="fa fa-envelope" aria-hidden="true"></i></p>
            <p>{data.personal.social.phone}<i className="fa fa-phone"></i></p>
            <p>{data.personal.social.location}<i className="fa fa-map-marker" aria-hidden="true"></i></p>
          </section>
        </div>

        <div className={resumeStyle.main}>
          <div className={resumeStyle.left}>
            <h2>Experience</h2>
            {data.experience.map((job, index) => {
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
                  <p><b>{job.startDate} - {job.endDate} ({duration})</b></p>
                  <ul>
                    {job.projects.map((detail, i) => (
                      <li key={i}>
                        <a href={`#project-${detail.projectName}`}>{detail.projectName}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className={resumeStyle.right}>
            <h2>Education</h2>
            {data.education.map((education, index) => (
              <div key={index}>
                <h3>{education.degree}</h3>
                <p>{education.school}</p>
                <p><b>{education.duration}</b></p>
              </div>
            ))}
            <h3>Language</h3>
            <p>{data.language}</p>
            <h2>Other experience</h2>
            <ul>
              {data.other_experience.map((other, index) => (
                <div key={index}>
                  <h3>{other.title}</h3>
                  <p>{other.company}</p>
                  <p>{other.startDate} - {other.endDate}</p>
                  <p>{other.details}</p>
                </div>
              ))}
            </ul>
            <h2>Award</h2>
            <ul>
              {data.award.map((award, index) => (
                <li key={index}>{award}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={resumeProjectStyle.container}>
        <h1>Project Detail</h1>
        {data.experience.map((job, jobIndex) => {
          const jobId = `job-${jobIndex}`;
          return (
            <div key={jobIndex} id={jobId}>
              <h2><b>{jobIndex + 1}. {job.title}: {job.company} <i>({job.startDate} - {job.endDate})</i></b></h2>
              {job.projects.map((project, projectIndex) => {
                return (
                  <div key={projectIndex}>
                    <div className={resumeProjectStyle.project}>
                      <h3 id={`project-${project.projectName}`}><b>{jobIndex + 1}.{projectIndex + 1}. {project.projectName} ({project.projectYear})</b></h3>
                      <ul>
                        <li><b>Overall:</b> {project.overall}</li>
                        <li><b>Techstack:</b> {project.techStack.join(", ")}</li>
                      </ul>
                    </div>
                    <br></br>
                  </div>
                );
              })}
              <br></br>
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default Resume;
