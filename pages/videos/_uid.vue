<template>
  <div class="content-wrapper blogpost">
    <navigation />
    <main id="main-content">
      <div class="video-header">
        <p>
          If you like what you see, please
          <a
            href="https://www.youtube.com/timbenniks?sub_confirmation=1"
            target="_blank"
            rel="noopener"
            >subscribe</a
          >
          to my YouTube channel at
          <a
            href="https://www.youtube.com/timbenniks"
            target="_blank"
            rel="noopener"
            >youtube.com/timbenniks</a
          >!
        </p>

        <figure class="youtube" style="--aspect-ratio: 16/9;">
          <iframe
            width="16"
            height="9"
            allowfullscreen
            frameborder="0"
            :data-src="
              document.data.video_embed.embed_url.replace(
                'watch?v=',
                'embed/'
              ) + '?autoplay=1&rel=0'
            "
          ></iframe>
        </figure>
      </div>
      <heading
        :title="$prismic.asText(document.data.title)"
        :breadcrumb="true"
        titletag="h1"
        :use-fancy-titles="true"
      />
      <div class="filters no-count">
        <nuxt-link
          v-for="tag in document.tags"
          :key="tag"
          :to="`/videos/?refinementList[tags][0]=${tag}`"
          class="filter"
        >
          {{ tag }}
        </nuxt-link>

        <!-- <span v-for="tag in document.tags" :key="tag" class="filter">{{
          tag
        }}</span> -->
      </div>

      <!-- eslint-disable vue/no-v-html -->
      <div
        ref="body"
        class="post-content"
        v-html="$prismic.asHtml(document.data.content)"
      ></div>
      <!--eslint-enable-->
      <related-videos :video="document" />
    </main>
  </div>
</template>

<script>
import LinkMixin from '@/assets/mixins/linkMixin'
import IframeMixin from '@/assets/mixins/iframeMixin'
import ImageMixin from '@/assets/mixins/imageMixin'
import mapMetaInfo from '@/assets/prismic/mapMetaInfo'

export default {
  mixins: [LinkMixin, IframeMixin, ImageMixin],
  async asyncData({ $prismic, params, error }) {
    try {
      const document = await $prismic.api.getByUID('video', params.uid)
      return {
        document,
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  head() {
    return mapMetaInfo(
      {
        id: this.document.uid,
        last_publication_date: this.document.last_publication_date,
        ...this.document.data,
      },
      'video',
      this.$router.currentRoute
    )
  },
}
</script>

<style lang="scss">
.blogpost .heading {
  margin: rem(0 auto 20px) !important;
  max-width: rem(800px);
}

.video-header {
  width: 100%;
  height: auto;
  max-width: rem(1440px);
  margin: 0 auto 3.75rem;
}

.post-content {
  max-width: rem(800px);
  margin: 3rem auto;

  p,
  li {
    line-height: 1.8;
    font-size: rem(18px);
    letter-spacing: 0.04em;
  }

  blockquote {
    border-left: 3px solid $blue-light;
    background: $blue-main;
    padding: rem(0 0 0 10px);

    p {
      font-size: rem(16px);
      font-style: italic;
    }
  }

  figure {
    margin: rem(0 0 32px);
    display: block;
    background: $blue-main;
    position: relative;
    border-bottom: 3px solid $blue-light;

    figcaption {
      position: absolute;
      bottom: 0;
      background: rgba($blue-main, 0.8);
      padding: rem(3px 7px);
      font-size: inherit;
      font-size: rem(16px);
    }
  }
}
</style>
