<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="categories">
    <section style="position: relative">
      <ul class="menu" v-if="categories">
        <li
          @mouseover="subMenu = category.children"
          @click="handleUpdate(category)"
          class="category-name"
          v-for="category of categories.filter((c) => c.level === 2)"
          :key="category.uid"
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
            :key="category.uid"
          >
            <div>{{ category.name }}</div>
          </li>
        </ul>
      </section>
    </section>

    <h1 class="header">{{ activeCategory.name }}</h1>
    <div v-if="loading_products">Loading...</div>
    <section v-else-if="items">
      <div class="products">
        <div class="product" v-for="product of items" :key="product.name">
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


<script lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { computed, ComputedRef, reactive, Ref } from "vue";

import gql from "graphql-tag";

interface Category {
  uid: string;
  name: string;
  level: number;
  children: Category[];
  position?: string;
  staged?: string;
  breadcrumbs?: {
    category_name: string;
  };
  meta_description?: string;
  meta_keywords?: string;
  meta_title?: string;
  description?: string;
  type?: string;
  display_mode?: string;
  image?: string;
  path: string;
  path_in_store?: string;
}
interface Variables {
  uid: string;
  currentPage?: number;
  pageSize?: number;
}
interface Products {
  name: string;
  page_size: number;
  current_page: number;
  total_pages: number;
  image: {
    url: string;
  };
  price_tiers?: {
    quantity?: [];
  };
  price_range: {
    maximum_price: {
      final_price: {
        currency: string;
        value: number;
      };
    };
  };
}

interface PageInfo {
  page_size: number;
  current_page: number;
  total_pages: number;
}
interface Data {
  loading_products: Ref<boolean>;
  page_info: ComputedRef<PageInfo>;
  categories: ComputedRef<Category[]>;
  items: ComputedRef<Products[]>;
  loading: Ref<boolean>;
  updateProducts: (
    uid: string,
    current_page: number,
    page_size: number
  ) => void;
}

export default {
  name: "App",
  data: () => {
    return {
      activeCategory: { uid: "MTg=", name: "Tops", level: 2 },
      subMenu: [] as Category[],
    };
  },
  methods: {
    handleUpdate(category: Category) {
      this.updateProducts(category.uid, 1, 20);
      this.activeCategory = category;
    },

    handlePagination(page: number) {
      this.updateProducts(
        this.activeCategory.uid,
        page,
        this.page_info.page_size
      );
    },
  },

  setup() {
    const variables: Variables = reactive({
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
                level
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
      { notifyOnNetworkStatusChange: true }
    );

    const updateProducts = (
      uid: string,
      currentPage?: number,
      pageSize?: number
    ) => {
      variables.uid = uid;
      if (currentPage) variables.currentPage = currentPage;
      if (pageSize) variables.pageSize = pageSize;
    };

    const categories = computed(
      () => (result.value?.categories.items as Category[]) ?? []
    );
    const items = computed(
      () => (products.result.value?.products.items as Products[]) ?? []
    );
    const page_info = computed(
      () => (products.result.value?.products.page_info as PageInfo) ?? []
    );

    return {
      loading_products: products.loading,
      page_info,
      categories,
      items,
      loading,
      updateProducts,
    } as Data;
  },
};
</script>


<style >
.menu {
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  padding: 5px 0 5px 0;
  justify-content: center;
}

.menu .category-name {
  padding: 5px;
  height: 25px;
  width: fit-content;
  text-align: center;
}

.sub-menu {
  position: absolute;
  top: 13%;
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
  padding-top: 20px;
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
