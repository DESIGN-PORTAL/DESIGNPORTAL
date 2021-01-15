import Vue from 'vue';
import VueRouter from 'vue-router';

import Manage from '@/pages/Manage';
import Editor from '@/pages/Editor.vue';

import fontList from '@/pages/Manage/font/list.vue';
import fontEdit from '@/pages/Manage/font/edit.vue';

import musicList from '@/pages/Manage/music/list.vue';
import musicEdit from '@/pages/Manage/music/edit.vue';

import projectList from '@/pages/Manage/project/list.vue';

import about from '@/pages/Manage/about/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/manage/project',
  },
  {
    path: '/Editor',
    component: Editor,
  },
  {
    path: '/manage',
    component: Manage,
    children: [
      {
        path: 'font',
        component: fontList,
      },
      {
        path: 'font/:id',
        component: fontEdit,
      },
      {
        path: 'music',
        component: musicList,
      },
      {
        path: 'music/:id',
        component: musicEdit,
      },
      {
        path: 'project',
        component: projectList,
      },
      {
        path: 'about',
        component: about,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
