import React from 'react';
import styles from '../../styles/Resume.module.css';
import data from '../../utils/data/resume.json';
import style from '../../styles/ResumeProject.module.css';

const Resume = () => {
  return (
    <div>
      <div className={styles.container} id="resume">
        <div className={styles.header}>
          <section className={styles.jobTitle}>
            <h2>{data.personal.name}</h2>
            {data.personal.title.map((title, index) => (
              <h3 key={index}>{title}</h3>
            ))}
          </section>

          <section className={styles.imgArea}>
            <img src={data.personal.avatar} alt="" />
          </section>

          <section className={styles.social}>
            <p>{data.personal.social.linkedin}<i className="fa-brands fa-linkedin-in"></i></p>
            <p>{data.personal.social.email}<i className="fa fa-envelope" aria-hidden="true"></i></p>
            <p>{data.personal.social.phone}<i className="fa fa-phone"></i></p>
            <p>{data.personal.social.location}<i className="fa fa-map-marker" aria-hidden="true"></i></p>
          </section>
        </div>

        <div className={styles.main}>
          <div className={styles.left}>
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
                  <p>{job.startDate} - {job.endDate} ({duration})</p>
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
          <div className={styles.right}>
            <h2>Education</h2>
            {data.education.map((education, index) => (
              <div key={index}>
                <h3>{education.degree}</h3>
                <p>{education.major}</p>
                <p>{education.school}</p>
                <p>{education.duration}</p>
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

      <div className={style.container}>
        <h1>Project Detail</h1>
        {data.experience.map((job, jobIndex) => {
          const jobId = `job-${jobIndex}`;
          return (
            <div key={jobIndex} id={jobId}>
              <h2><b>{jobIndex + 1}. {job.title}</b></h2>
              <p><i>{job.company} ({job.startDate} - {job.endDate})</i></p>
              {job.projects.map((project, projectIndex) => {
                return (
                  <div key={projectIndex}>
                    <div className={style.project}>
                      <p id={`project-${project.projectName}`}><b>{jobIndex + 1}.{projectIndex + 1}. {project.projectName} ({project.projectYear})</b></p>
                      <ul>
                        <li><b>Overall:</b> {project.overall}</li>
                        <li><b>Domain:</b> {project.domain}</li>
                        <li><b>Techstack:</b> {project.techStack.join(", ")}</li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default Resume;
