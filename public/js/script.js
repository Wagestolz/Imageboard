// const { axios } = require('aws-sdk');

console.log('sanity check');

new Vue({
    el: '#main',
    data: {
        name: '',
        // seen: true,
        images: [],
        // myClassName: 'peter',
    },
    // mounted is a lifecycle method that we can access
    mounted: function () {
        console.log('Vue component mounted');
        var self = this;
        axios
            .get('/images')
            .then(function (res) {
                self.images = res.data;
            })
            .catch(function (error) {
                console.log('error at GET /', error);
            });
    },
    methods: {
        imageTitleMethod: function (image) {
            this.name = image;
        },
    },
});
