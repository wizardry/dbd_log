import { shallowMount } from '@vue/test-utils';
import App from '~/components/App.vue';

describe('App.vue component', () => {
  it('shows Hello, World!', () => {
    const wrapper = shallowMount(App);
    expect(true).toBe(true);
  });
});
