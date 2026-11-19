import React from 'react';
import { Link2, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { getDuration } from "@/utils/common";
import { useI18n } from "@/libs/i18n/I18nContext";
import { withLocale } from "@/lib/with-locale";
import data from '../../utils/data/resume.json';
import resumeStyle from '../../styles/Resume.module.css';
import resumeProjectStyle from '../../styles/ResumeProject.module.css';

const Resume = () => {
  const { t } = useI18n();
  return (
    <div>
      <DefaultSeo {...SEO} title={t("resume.seoTitle")} />
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
            <p>{data.personal.social.linkedin}<Link2 size={20} aria-hidden="true" style={{ marginLeft: 10 }} /></p>
            <p>{data.personal.social.email}<Mail size={20} aria-hidden="true" style={{ marginLeft: 10 }} /></p>
            <p>{data.personal.social.location}<MapPin size={20} aria-hidden="true" style={{ marginLeft: 10 }} /></p>
          </section>
        </div>

        <div className={resumeStyle.main}>
          <div className={resumeStyle.left}>
            <h2>Professional Experience</h2>
            {data.experience.map((job, index) => {
              const duration = getDuration(job.startDate, job.endDate);

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
            <h2>Education & Certifications</h2>
            {data.education.map((education, index) => (
              <div key={index}>
                <h3>{education.degree}</h3>
                <p>{education.school}</p>
                <p><b>{education.duration}</b></p>
              </div>
            ))}
            <h3>Language</h3>
            <p>{data.language}</p>
            <h2>Additional Experience</h2>
            {data.other_experience.map((other, index) => (
              <div key={index}>
                <h3>{other.title}</h3>
                <ul>
                  {other.info_list.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h2>Award</h2>
            <ul>
              {data.award.map((award, index) => (
                <li key={index}>{award}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={resumeProjectStyle.container} id="project-detail">
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
export const getStaticProps = withLocale("vi");
