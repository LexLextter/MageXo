<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="categories">
    <section @mouseleave="subMenu = []">
      <ul class="nav" v-if="categories">
        <li
          @mouseover="subMenu = category.children"
          @click="handleUpdate(category)"
          class="name"
          v-for="category of categories.filter((c) => c.level === 2)"
          :key="category.id"
        >
          <div>{{ category.name }}</div>
        </li>
      </ul>
      <hr />
      <section v-if="subMenu.length > 0">
        <ul class="nav" v-if="categories">
          <li
            @click="handleUpdate(category)"
            class="name"
            v-for="category of subMenu"
            :key="category.id"
          >
            <div>{{ category.name }}</div>
          </li>
        </ul>
      </section>
    </section>
    <hr />
    <h1 class="header">{{ activeCategory.name }}</h1>
    <div v-if="loading_products">Loading...</div>
    <section v-else-if="items" class="products">
      <div class="product" v-for="product of items" :key="product.uid">
        <span v-html="product.description.html"></span>
        <img :src="product.image.url" class="img" />
      </div>
      <div v-if="page_info && page_info.total_pages > 1">
        <button class="btn" @click="handlePagination(1)">{{ "<<" }}</button>
        <button
          class="btn"
          :class="{
            active: page === page_info.current_page,
          }"
          v-for="page in page_info.total_pages"
          :key="page"
          @click="handlePagination(page)"
        >
          {{ page }}
        </button>
        <button class="btn" @click="handlePagination(page_info.total_pages)">
          >>
        </button>
      </div>
    </section>
  </div>
</template>


<script>
import { useQuery } from "@vue/apollo-composable";
import { computed, reactive } from "vue";

import gql from "graphql-tag";

// Fix sub categories to give back uid
// Fix pagination style
// Fix Cards to show title, picture and price
// Fix Nav styles
// default products are wierd

export default {
  name: "App",
  data: () => {
    return {
      activeCategory: { uid: "MTg=", name: "Tops" },
      subMenu: false,
    };
  },
  methods: {
    handleUpdate(category) {
      console.log(category);
      this.updateProducts(category.uid);
      this.activeCategory = category;
    },

    handlePagination(page) {
      this.updateProducts(
        this.activeCategory.uid,
        page,
        this.page_info.page_size
      );
    },
  },

  setup(activeCategory) {
    const variables = reactive({
      uid: activeCategory.uid,
    });

    const { result, loading } = useQuery(
      gql`
        query getCategories {
          categories(filters: {}) {
            items {
              name
              uid
              position
              staged
              level
              children {
                name
                uid
              }
              breadcrumbs {
                category_name
              }
              meta_description
              meta_keywords
              meta_title
              description
              type
              display_mode
              image
              path
              path_in_store
            }
          }
        }
      `
    );

    const products = useQuery(
      gql`
        query getProducts($uid: String, $pageSize: Int, $currentPage: Int) {
          products(
            filter: { category_uid: { eq: $uid } }
            pageSize: $pageSize
            currentPage: $currentPage
          ) {
            page_info {
              page_size
              current_page
              total_pages
            }
            items {
              name
              image {
                url
              }
              description {
                html
              }
            }
          }
        }
      `,
      variables,
      { notifyOnNetworkStatusChange: true, awaitRefetchQueries: true }
    );

    const updateProducts = (uid, currentPage, pageSize) => {
      variables.uid = uid;
      variables.currentPage = currentPage;
      variables.pageSize = pageSize;
    };

    const categories = computed(() => result.value?.categories.items ?? []);
    const items = computed(() => products.result.value?.products.items ?? []);
    const page_info = computed(
      () => products.result.value?.products.page_info ?? []
    );

    return {
      loading_products: products.loading,
      page_info,
      categories,
      items,
      loading,
      updateProducts,
    };
  },
};
</script>


<style scoped>
.nav {
  display: flex;
  list-style-type: none;
  gap: 10px;
  width: 150px;
  padding: 0;
  height: 100px;
}

.nav .name {
  border: solid pink 1px;
  padding: 5px;
  height: 80px;
  width: 117px;
  text-align: center;
}

.name:hover {
  cursor: pointer;
  background-color: aqua;
  color: black;
}

.product {
  border: solid 1px blue;
  padding: 5px;
  width: 300px;
  display: flex;
}
.products {
  display: flex;
  gap: 10px;
  width: fit-content;
  flex-wrap: wrap;
}

.header {
  display: flex;
  justify-content: center;
}

.img {
  width: 150px;
  height: 150px;
}

.btn {
  width: 30px;
  height: 30px;
  background-color: white;
  color: black;
  border: none;
}
.active {
  background-color: rgb(143, 143, 221);
}

.btn:hover {
  cursor: pointer;
  background-color: gray;
}
</style>
