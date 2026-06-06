<template>
  <Transition>
    <LoaderComponent
      v-if="!playlistsReady"
      class="loader"
    />
  </Transition>
  <Transition>
    <HeroComponent
      v-if="playlistsReady"
      :playlists="filteredPlaylists"
      :selected-content="selectedContent"
      :filtering="filteredPlaylists ? true : false"
      @update:selected-content="updateSelectedContent($event)"
    />
  </Transition>
  <div class="container">
    <div class="row">
      <Transition>
        <LatestTracksComponent
          v-if="playlistsReady"
          :playlists="{
            mp3: playlists.mp3,
            wav: playlists.wav,
            video: playlists.video,
            extra: playlists.extra
          }"
        />
      </Transition>
    </div>
    <div class="row">
      <Transition>
        <h2 v-if="playlistsReady">
          Search
        </h2>
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="d-none"
          size-tablet=""
          size-desktop="d-lg-block col-lg-4"
          placeholder="Search artist"
          @update:update-value="textFilterArtist = $event"
        />
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="d-none"
          size-tablet=""
          size-desktop="d-lg-block col-lg-4"
          placeholder="Search title"
          @update:update-value="textFilterTitle = $event"
        />
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="col-12"
          size-tablet="col-md-12"
          size-desktop="col-lg-4"
          placeholder="Search track"
          @update:update-value="textFilter = $event"
        />
      </Transition>
    </div>
    <div class="row">
      <Transition>
        <PlaylistComponent
          :playlists="filteredPlaylists"
          :selected-content="selectedContent"
          :text-filter="textFilter"
          :text-filter-artist="textFilterArtist"
          :text-filter-title="textFilterTitle"
          @update:selected-content="updateSelectedContent($event)"
        />
      </Transition>
    </div>
  </div>
  <Transition name="pop-b">
    <AudioPlayer
      v-if="playlistsReady"
      :playlist="playlists.mp3"
      :selected-content="selectedContent"
      @update:selected-content="updateSelectedContent($event)"
    />
  </Transition>
  <SupportComponent />
</template>

<script setup>
import {
  onMounted, reactive, ref, computed, watch
} from 'vue';
import { useHead } from '@unhead/vue'
import array from '@/helpers/array';
import { useRouter, useRoute } from 'vue-router';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer.vue';
import HeroComponent from '@/components/HeroComponent.vue';
import LatestTracksComponent from '@/components/LatestTracksComponent.vue';
import PlaylistComponent from '@/components/Playlist/PlaylistComponent.vue';
import TextFilter from '@/components/Filters/TextFilter.vue';
import SupportComponent from '@/components/Tools/SupportComponent.vue';
import LoaderComponent from '@/components/Tools/loaderComponent.vue';

const router = useRouter();
const route = useRoute();

// Dynamic meta tags based on current route
const currentTrack = computed(() => {
  if (!route.params.slug) return null;
  
  const allTracks = [
    ...(playlists.mp3 || []),
    ...(playlists.wav || []),
    ...(playlists.video || [])
  ];
  
  return allTracks.find(t => t.slug === route.params.slug) || null;
});

const pageTitle = computed(() => 
  currentTrack.value 
    ? `${currentTrack.value.artist} - ${currentTrack.value.title}`
    : 'Lazerzf!ne - Music Remixes & Bootlegs'
);

const pageDescription = computed(() => 
  currentTrack.value
    ? `Listen to ${currentTrack.value.title} by ${currentTrack.value.artist}`
    : 'Discover the latest remixes and bootlegs by Lazerzf!ne. Electronic and dance music.'
);

const pageUrl = computed(() => 
  currentTrack.value
    ? `https://www.lazerzfine.com/track/${currentTrack.value.slug}`
    : 'https://www.lazerzfine.com/'
);

const pageImage = computed(() => 
  currentTrack.value?.cover || 'https://www.lazerzfine.com/images/default-cover.jpg'
);

// Structured data for track pages
const structuredData = computed(() => {
  if (!currentTrack.value) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": currentTrack.value.title,
    "byArtist": {
      "@type": "MusicGroup",
      "name": currentTrack.value.artist
    },
    "datePublished": currentTrack.value.date || '2024-01-01',
    "url": `https://www.lazerzfine.com/track/${currentTrack.value.slug}`,
    "description": currentTrack.value.description || 'Remix by Lazerzf!ne',
    "genre": currentTrack.value.genre || 'Electronic',
    "inAlbum": {
      "@type": "MusicAlbum",
      "name": "Lazerzf!ne Remixes"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lazerzf!ne",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.lazerzfine.com/images/logo.jpg"
      }
    }
  };
});

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: currentTrack.value ? 'music.song' : 'website' },
    { property: 'og:image', content: pageImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage }
  ],
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: structuredData.value ? [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ] : []
})

// Fallback title update in case useHead doesn't work
watch(() => pageTitle.value, (newTitle) => {
  document.title = newTitle;
}, { immediate: true });

const pushedContent = reactive([]);
const selectedContent = ref(null);
const textFilter = ref(null);
const textFilterArtist = ref(null);
const textFilterTitle = ref(null);
const playlists = reactive({});
const playlistsReady = computed(() => playlists.mp3
  && playlists.wav
  && playlists.video
  && playlists.extra);

function updateSelectedContent(id) {
  const allPlaylists = [...(playlists.mp3 || []), ...(playlists.wav || []), ...(playlists.video || [])];
  const music = allPlaylists.find(m => m.id === id);
  if (music) {
    selectedContent.value = id;
    router.push({ name: 'Track', params: { slug: music.slug } });
  }
}

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    const allPlaylists = [...(playlists.mp3 || []), ...(playlists.wav || []), ...(playlists.video || [])];
    const music = allPlaylists.find(m => m.slug === newSlug);
    if (music) {
      selectedContent.value = music.id;
    }
  }
});

function textFilterPlaylists() {
  const arr = array.objectMap(playlists, (value) => value.filter((music) => {
    const textSearchValue = textFilter?.value?.normalize('NFC').toLowerCase();
    const textSearchValueArtist = textFilterArtist?.value?.normalize('NFC').toLowerCase();
    const textSearchValueTitle = textFilterTitle?.value?.normalize('NFC').toLowerCase();
    const filter = music.filter ? music.filter.normalize('NFC').toLowerCase() : '';
    const filterArtist = music.artistfilter ? music.artistfilter.normalize('NFC').toLowerCase() : '';
    const filterTitle = music.titlefilter ? music.titlefilter.normalize('NFC').toLowerCase() : '';
    const filterIncludeSearch = textFilter.value?.length >= 3
      ? filter.includes(textSearchValue)
      : true;
    const filterArtistIncludeSearch = textFilterArtist.value?.length >= 3
      ? filterArtist.includes(textSearchValueArtist)
      : true;
    const filterTitleIncludeSearch = textFilterTitle.value?.length >= 3
      ? filterTitle.includes(textSearchValueTitle)
      : true;
    return filterIncludeSearch && filterArtistIncludeSearch && filterTitleIncludeSearch;
  }));
  if ((textFilter.value?.length >= 3
  || textFilterArtist.value?.length >= 3
  || textFilterTitle.value?.length >= 3)
  && (arr.mp3.findIndex((m) => m.id === selectedContent.value) === -1
  && arr.wav.findIndex((m) => m.id === selectedContent.value) === -1
  && arr.video.findIndex((m) => m.id === selectedContent.value) === -1)) {
    selectedContent.value = arr.mp3[0]?.id || arr.wav[0]?.id || arr.video[0]?.id;
    const allPlaylists = [...(arr.mp3 || []), ...(arr.wav || []), ...(arr.video || [])];
    const music = allPlaylists.find(m => m.id === selectedContent.value);
    if (music) {
      router.push({ name: 'Track', params: { slug: music.slug } });
    }
  }
  return arr;
}

const filteredPlaylists = computed(() => (playlists.mp3
&& playlists.wav && playlists.video && playlists.extra ? textFilterPlaylists() : {}));

onMounted(async () => {
  const playlistPushedContent = await fetch('/jsons/playlistPushedContent.json');
  const playlistJson = await fetch('/jsons/playlist.json');
  const playlistLosslessJson = await fetch('/jsons/playlistLossless.json');
  const playlistVideoJson = await fetch('/jsons/playlistVideo.json');
  const playlistExtra = await fetch('/jsons/playlistExtra.json');
  pushedContent.value = await playlistPushedContent.json();
  playlists.mp3 = await playlistJson.json();
  playlists.wav = await playlistLosslessJson.json();
  playlists.video = await playlistVideoJson.json();
  playlists.extra = await playlistExtra.json();
  
  if (route.params.slug) {
    const allPlaylists = [...(playlists.mp3 || []), ...(playlists.wav || []), ...(playlists.video || [])];
    const music = allPlaylists.find(m => m.slug === route.params.slug);
    if (music) {
      selectedContent.value = music.id;
    }
  } else if (!selectedContent.value && pushedContent.value.length > 0) {
    selectedContent.value = pushedContent.value[0].id;
    const allPlaylists = [...(playlists.mp3 || []), ...(playlists.wav || []), ...(playlists.video || [])];
    const music = allPlaylists.find(m => m.id === selectedContent.value);
    if (music) {
      router.push({ name: 'Track', params: { slug: music.slug } });
    }
  }
});
</script>

<style lang="scss">
@import '@/styles/bootstrap-grid';
@import '@/styles/main';
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.pop-b-enter-active,
.pop-b-leave-active {
  transform: translateY(55vh);
  transition: transform 1s ease;
  transition-delay: 1s;
}

.pop-b-enter-from,
.pop-b-leave-to {
  transform: translateY(100%);
}
</style>
