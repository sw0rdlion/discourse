import computed from 'ember-addons/ember-computed-decorators';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Component.extend({
  tagName: '',
  publishing: false,

  @computed('topic.destination_category_id')
  validCategory(destCatId) {
    return destCatId &&
      destCatId !== this.site.shared_drafts_category_id;
  },

  actions: {
    updateDestinationCategory(category) {
      ajax(`/t/${this.get('topic.id')}/shared-draft`, {
        method: 'PUT',
        data: { category_id: category.get('id') }
      });
    },

    publish() {
      bootbox.confirm(I18n.t('shared_drafts.confirm_publish'), result => {
        if (result) {
          this.set('publishing', true);
          let destId = this.get('topic.destination_category_id');
          this.get('topic').publish().then(() => {
            this.set('topic.category_id', destId);
          }).finally(() => {
            this.set('publishing', false);
          });
        }
      });
    }
  }
});
