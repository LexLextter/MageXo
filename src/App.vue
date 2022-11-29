<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="categories">
    <section>
      <ul class="menu" v-if="categories">
        <li
          @mouseover="subMenu = category.children"
          @click="handleUpdate(category)"
          class="category-name"
          v-for="category of categories.filter((c) => c.level === 2)"
          :key="category.id"
        >
          <div>{{ category.name }}</div>
        </li>
      </ul>
      <section v-if="subMenu.length > 0">
        <ul class="menu sub-menu" v-if="categories">
          <li
            @click="handleUpdate(category)"
            class="category-name"
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
    <section v-else-if="items">
      <div class="products">
        <div class="product" v-for="product of items" :key="product.uid">
          <img :src="product.image.url" class="img" />
          <span>{{ product.name }}</span>
          <span
            >{{ product.price_range.maximum_price.final_price.value }}
            {{ product.price_range.maximum_price.final_price.currency }}</span
          >
        </div>
      </div>
      <div class="pagination" v-if="page_info && page_info.total_pages > 1">
        <button class="page" @click="handlePagination(1)">{{ "<<" }}</button>
        <button
          class="page"
          :class="{
            active: page === page_info.current_page,
          }"
          v-for="page in page_info.total_pages"
          :key="page"
          @click="handlePagination(page)"
        >
          {{ page }}
        </button>
        <button class="page" @click="handlePagination(page_info.total_pages)">
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

// default products are weird

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

  setup() {
    const variables = reactive({
      uid: "MTg=",
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
              price_tiers {
                quantity
              }
              price_range {
                maximum_price {
                  final_price {
                    currency
                    value
                  }
                }
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
.menu {
  display: flex;
  list-style-type: none;
  gap: 10px;
  width: 100%;
  padding: 0;
  justify-content: center;
}

.menu .category-name {
  padding: 5px;
  height: 80px;
  width: fit-content;
  text-align: center;
}

.sub-menu {
  position: absolute;
  top: 5%;
}

.category-name:hover {
  cursor: pointer;
  font-weight: bold;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  width: inherit;
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
  width: 340px;
  height: 375px;
}

.page {
  width: 30px;
  height: 30px;
  background-color: white;
  color: black;
  border: none;
}
.active {
  border: 1px solid black;
}

.page:hover {
  cursor: pointer;
  font-weight: bold;
}

.pagination {
  padding: 5px;
}
</style>
