<template>
  <ul class="nav" v-if="categories">
    <li
      @mouseover="subMenu = category.children"
      @click="activeCategory = category.name"
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
        @click="activeCategory = category.name"
        class="name"
        v-for="category of subMenu"
        :key="category.id"
      >
        <div>{{ category.name }}</div>
      </li>
    </ul>
  </section>
  <section class="products">
    <div
      class="product"
      v-for="product of getCategory.products.items"
      :key="product.uid"
    >
      <span v-html="product.description.html"></span>
    </div>
  </section>
</template>


<script>
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";

import gql from "graphql-tag";

export default {
  name: "App",
  data: () => {
    return {
      activeCategory: "Tops",
      subMenu: false,
    };
  },
  computed: {
    getCategory() {
      console.log(this.categories);
      return this.categories.filter(
        (cat) => cat.name === this.activeCategory
      )[0];
    },
  },
  setup() {
    /*  const { result } = useQuery(gql`
      query getCategories {
        categories(filters: {}) {
          items {
            name
            description
            type
            display_mode
            image
            products {
              items {
                name
                image {
                  position
                }
                description {
                  html
                }
                reviews {
                  items {
                    nickname
                    text
                  }
                }
              }
            }
            product_count
          }
        }
      }
    `); */

    const { result } = useQuery(
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
              products {
                items {
                  price_range {
                    maximum_price {
                      discount {
                        amount_off
                        percent_off
                      }
                      final_price {
                        currency
                        value
                      }
                      fixed_product_taxes {
                        amount {
                          currency
                          value
                        }
                        label
                      }
                      regular_price {
                        currency
                        value
                      }
                    }
                    minimum_price {
                      regular_price {
                        currency
                        value
                      }
                    }
                  }
                  price_tiers {
                    discount {
                      amount_off
                      percent_off
                    }
                    final_price {
                      currency
                      value
                    }
                    quantity
                  }
                  rating_summary
                  thumbnail {
                    disabled
                    label
                    position
                    url
                  }
                  uid
                  short_description {
                    html
                  }
                  sku
                  small_image {
                    disabled
                    label
                    position
                    url
                  }
                  staged
                  country_of_manufacture
                  meta_description
                  meta_keyword
                  meta_title
                  name
                  image {
                    position
                  }
                  description {
                    html
                  }
                  reviews {
                    items {
                      nickname
                      text
                    }
                  }
                }
              }
              product_count
            }
          }
        }
      `
    );

    const categories = computed(() => result.value?.categories.items ?? []);

    return { result, categories };
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
</style>
