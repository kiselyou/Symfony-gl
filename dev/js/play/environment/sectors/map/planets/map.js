export const PLANET_NAMES = {};

export const PLANET_EARTH = 1;
PLANET_NAMES[PLANET_EARTH] = 'Earth';

export const PLANET_PATH = {};
PLANET_PATH[PLANET_EARTH] = {
	map: './src/img/planets/earth/1k_earth_map.jpg',
	bump: './src/img/planets/earth/1k_earth_bump.jpg',
	spec: './src/img/planets/earth/1k_earth_spec.jpg',
	cloud_map: './src/img/planets/earth/1k_earth_cloud_map.jpg',
	cloud_map_trans: './src/img/planets/earth/1k_earth_cloud_map_trans.jpg'
};

export const PLANET_MOON = 2;
PLANET_NAMES[PLANET_MOON] = 'Moon';
PLANET_PATH[PLANET_MOON] = {
	map: './src/img/planets/moon/1k_moon_map.jpg',
	bump: './src/img/planets/moon/1k_moon_bump.jpg',
	spec: null,
	cloud_map: null,
	cloud_map_trans: null
};

export const PLANET_SUN = 3;
PLANET_NAMES[PLANET_SUN] = 'Sun';
PLANET_PATH[PLANET_SUN] = {
	map: './src/img/planets/sun/2k_sun_map.jpg',
	bump: null,
	spec: null,
	cloud_map: null,
	cloud_map_trans: null
};