// const { axios } = require('aws-sdk');

(function () {
    console.log('sanity check');

    Vue.component('modal-component', {
        template: '#template', // the id of the script tag below vue instance
        props: ['sayGreeting', 'clickId'],
        // props: ['sayGreeting', 'id', 'url', 'title', 'description'],
        data: function () {
            // data is a function for component (own data set)
            return {
                image: {
                    id: '',
                    url: '',
                    username: '',
                    title: '',
                    description: '',
                    created_at: '',
                },
            };
        },
        mounted: function () {
            console.log('Vue Modal component mounted');
            var self = this;
            axios
                .get('/modal', { params: { id: this.clickId } })
                .then(function (res) {
                    self.image = res.data[0]; // data property holds body of response
                })
                .catch(function (error) {
                    console.log('error at GET /modal', error);
                });
        },
        methods: {
            closeModal: function () {
                console.log('about to emit an event from component');
                this.$emit('close');
            },
        },
    });

    var app = new Vue({
        el: '#main',
        data: {
            title: '',
            description: '',
            user: '',
            image: null,
            inputField: '',
            images: [],
            clickId: null,
        },
        // "mounted" lifecycle hook
        mounted: function () {
            console.log('Vue instance mounted');
            var self = this;
            axios
                .get('/images')
                .then(function (res) {
                    self.images = res.data; // data property holds body of response
                })
                .catch(function (error) {
                    console.log('error at GET /', error);
                });
        },
        methods: {
            handleFileChange: function (e) {
                this.image = e.target.files[0];
                this.inputField = e.target.files[0].name;
            },
            handleUpload: function (e) {
                e.preventDefault();
                var self = this;
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('image', this.image);
                formData.append('user', this.user);
                formData.append('description', this.description);
                axios
                    .post('/upload', formData)
                    .then(function (res) {
                        self.images.unshift(res.data);
                    })
                    .catch(function (error) {
                        console.log('error in POST /upload', error);
                    });
            },
            setImageId: function (e, id) {
                this.clickId = id;
            },
            closeMe: function () {
                this.clickId = null;
            },
        },
    });
})();
