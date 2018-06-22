import { shallowMount } from '@vue/test-utils';
import Sample from '~/components/Sample.vue';

describe('Sample.vue component', () => {
  it('shows Hello, World!', () => {
    const wrapper = shallowMount(Sample);
    expect(wrapper.text()).toBe('Hello, World!');
  });
});
