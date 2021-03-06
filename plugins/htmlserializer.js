const prismicDOM = require('prismic-dom')
const CloudinarySDK = require('cloudinary-core')
const linkResolver = require('./linkresolver')

const cloudinary = new CloudinarySDK.Cloudinary({
  cloud_name: 'dwfcofnrd',
  secure: true,
})

function getSrcSet(baseUrl, widths) {
  const cleanUrl = baseUrl.replace('?auto=compress,format', '')
  let srcset = ''

  widths.forEach((width) => {
    const url = cloudinary.url(cleanUrl, {
      crop: 'scale',
      width,
      quality: 'auto',
      fetchFormat: 'auto',
      type: 'fetch',
    })

    srcset += `${url} ${width}w, `
  })

  return srcset.slice(0, -1)
}

const nativeLazySupported = true

const Elements = prismicDOM.RichText.Elements

module.exports = function (type, element, content, children) {
  if (type === Elements.hyperlink) {
    let result = ''
    const url = prismicDOM.Link.url(element.data, linkResolver)

    if (element.data.link_type === 'Document') {
      result = `<a href="${url}" data-internal-link>${content}</a>`
    } else {
      const target = element.data.target
        ? `target="'${element.data.target}'" rel="noopener"`
        : ''
      result = `<a href="${url}" ${target}>${content}</a>`
    }
    return result
  }

  if (type === Elements.image) {
    const result = `
      <figure style="--aspect-ratio:${element.dimensions.width}/${
      element.dimensions.height
    };">
        <img
          ${
            nativeLazySupported ? 'srcset' : 'data-srcset'
          }="${getSrcSet(element.url, [300, 400, 500, 600, 700, 800])}"
          ${
            nativeLazySupported ? 'sizes' : 'data-sizes'
          }="(max-width: 700px) 90vw, (min-width: 880px) 800px"
          alt="${element.alt}"
          title="${element.alt}"
          ${nativeLazySupported ? 'loading="lazy"' : ''}"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          class="${!nativeLazySupported ? 'lazy' : ''}"
          width="${element.dimensions.width}"
          height="${element.dimensions.height}"
        />
        <figcaption>${element.alt}</figcaption>
      </figure>
      `

    return result
  }

  if (type === Elements.heading3) {
    return `<h3 class="fancy-title red">${element.text}</h3>`
  }

  if (type === Elements.heading4) {
    return `<h4 class="fancy-title blue-main">${element.text}</h4>`
  }

  if (type === Elements.heading5) {
    return `<h5 class="fancy-title yellow">${element.text}</h5>`
  }

  if (type === Elements.embed) {
    let result = ''

    if (element.oembed.provider_name === 'YouTube') {
      result = `
        <figure style="--aspect-ratio:16/9;">
          <iframe
            width="16"
            height="9"
            allow="autoplay"
            allowfullscreen
            frameborder="0"
            data-src="${element.oembed.embed_url.replace(
              'watch?v=',
              'embed/'
            )}"></iframe>
        </figure>
      `
    }

    if (element.oembed.provider_name === 'article') {
      result = `
        <figure style="--aspect-ratio:16/9;">
          <iframe
            width="16"
            height="9"
            allowfullscreen
            frameborder="0"
            data-src="${element.oembed.embed_url}"></iframe>
        </figure>
      `
    }

    if (element.oembed.provider_name === 'Tims_Strava') {
      result = `
        <p class="for-small-screens">Strava embeds do not work on small screens. Click <a title="direct strava link" href="${element.oembed.embed_url}" target="_blank" rel="noopener">here</a> for the direct strava link.</p>
        <figure style="--aspect-ratio:590/293;" class="strava-embed">
          <iframe
            width="590"
            height="293"
            allowfullscreen
            frameborder="0"
            data-src="${element.oembed.embed_url}"></iframe>
        </figure>
      `
    }

    return result
  }

  return null
}
