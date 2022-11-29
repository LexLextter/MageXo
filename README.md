# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).


## There are three  main issues I had with this task. 
 
 1. First was the CORSE error which I could not resolve and so I had to simply overlook it with a browser plugin. -> 
 2. Second was my lack of experience with GraphQL - this took the most time
 3. The last issue is with testing libraries. There are no unit tests here exactly because it would take a lot of time and it feels more reasonable to say this. The amount of changes, together with graphQL for test was too much. So I decided to send the aplication without unit tests anyway. 

This took me about 2MD give or take, mostly because of research. (It has been a while since I used Vue 2 and never used Vue 3 with typescript, and I never used GraphQL only rest)

The aplication has a fairly light design and it could be split in to several components. However the amount of code is pretty low, so it could fit in to one component in my opinion. Since most functionality is done from the states of the queries, the component only handles fetching the data and showing the template with a simple style. 
Theoretically pagination and navigations could be their own components, while fetching the data stand alone service. 
