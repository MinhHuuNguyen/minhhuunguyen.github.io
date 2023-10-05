import ActivityCard from '@/components/page_specific/home/ActivityCard';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const completed: Activity[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tag: 'dd/mm/yyyy',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae sequi aut dolore aspernatur ad iure officia sit aperiam, culpa in.'
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tag: 'dd/mm/yyyy',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae sequi aut dolore aspernatur ad iure officia sit aperiam, culpa in.'
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
    tag: 'dd/mm/yyyy',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae sequi aut dolore aspernatur ad iure officia sit aperiam, culpa in.'
  },
  {
    imgUrl: "https://media.istockphoto.com/id/176237005/photo/looking-out-for-each-other.jpg?s=170667a&w=0&k=20&c=MEQCN3Ow73O174VSAKwpnzXLdPOMIJI-i6zJOBFo5NE=",
    tag: 'dd/mm/yyyy',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae sequi aut dolore aspernatur ad iure officia sit aperiam, culpa in.'
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    tag: 'dd/mm/yyyy',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae sequi aut dolore aspernatur ad iure officia sit aperiam, culpa in.'
  }
]

const Activity: NextPage = () => {
  const [tab, setTab] = useState<Number>(0);
  const [activities, setActivities] = useState<Activity[]>(completed);

  useEffect(() => {
    setActivities(tab == 0 ? completed : completed);
  }, [tab]);

  return (
    <section className="acti-news lg:pt-3 pt-4">
      <div className="flex flex-col justify-center align-center mb-5">
        <h1 className="title-section mb-2" data-aos="fade-right">hoạt động - dự án</h1>
        <span className="span-section">Những hoạt động đã, đang được tổ chức bởi Khoảng Trời Của Bé.</span>
      </div>
      
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap flex flex-wrap list-none pl-0 mb-0  mb-5">
          <li className="mr-2 ">
            <button className="inline-block py-2 px-4 no-underline border border-blue bg-blue rounded text-white mx-1 active" onClick={() => setTab(0)}>Đã tổ chức</button>
          </li>
          <li className="mr-2 ">
            <button className="inline-block py-2 px-4 no-underline border border-blue bg-blue rounded text-white mx-1" onClick={() => setTab(1)}>Đang triển khai</button>
          </li>
        </ul>
      </div>
      <div id="pills-tabContent">
        <div className="p-6 tab-pane opacity-0 opacity-100 block active flex flex-row">
          {activities.map((activity: Activity) => (
            <ActivityCard activity={activity} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Activity;
