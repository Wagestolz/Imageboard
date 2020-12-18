(function () {
    Vue.component('comment-component', {
        template: '#comment-template',
        props: ['clickId'],
        data: function () {
            // data is a function for component (own data set)
            return {
                comments: [],
                username: '',
                comment: '',
                empty: false,
            };
        },
        mounted: function () {
            console.log('Vue Comment component mounted');
            var self = this;
            self.empty = false;
            axios // HTTP request to retrieve the all comments
                // GET to /comments/:imageId
                .get(`/comments/:${this.clickId}`, {
                    params: { imageId: this.clickId },
                })
                .then(function (res) {
                    if (res.data.length > 0) {
                        self.comments = res.data;
                    } else {
                        self.empty = true;
                    }
                })
                .catch(function (error) {
                    console.log('error at GET /comments/:imageId', error);
                });
        },
        methods: {
            postComment: function () {
                var self = this;
                axios
                    .post('/comment', {
                        username: this.username,
                        comment: this.comment,
                        imageId: this.clickId,
                    })
                    .then(function (res) {
                        self.comments.unshift(res.data);
                    })
                    .catch(function (error) {
                        console.log('error in POST /comment', error);
                    });
            },
        },
    });

    Vue.component('modal-component', {
        template: '#modal-template', // the id of the script tag below vue instance
        props: ['clickId'],
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
        watch: {
            clickId: 'getModal',
        },
        mounted: function () {
            this.getModal();
        },
        methods: {
            closeModal: function () {
                this.$emit('close');
            },
            getModal: function () {
                var self = this;
                axios
                    .get('/modal', { params: { id: self.clickId } })
                    .then(function (res) {
                        if (res.data.notfound) {
                            self.closeModal();
                        }
                        self.image = res.data[0]; // data property holds body of response
                    })
                    .catch(function (error) {
                        console.log('error at GET /modal', error);
                    });
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
            clickId: location.hash.slice(1),
            lowestId: null,
            more: true,
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
            addEventListener('hashchange', function () {
                self.clickId = location.hash.slice(1); // for open Modal
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
            // setImageId: function (e, id) {
            //     this.clickId = id;
            // },
            closeMe: function () {
                this.clickId = null;
                history.pushState({}, '', '/'); // reset link
            },
            getMore: function () {
                var self = this;
                var lastItemID = this.images[this.images.length - 1].id;
                if (self.images.length > 8) {
                    axios
                        .get('/more', {
                            params: {
                                lastid: lastItemID,
                            },
                        })
                        .then(function (res) {
                            self.images.push(...res.data);
                            self.lowestId = res.data[0].lowestId;
                            if (
                                self.images[self.images.length - 1].id ==
                                self.lowestId
                            ) {
                                self.more = false; // hide more button
                            }
                        })
                        .catch(function (error) {
                            console.log('error at GET /', error);
                        });
                } else {
                    self.more = false; // don't render button until at least 9 images uploaded
                }
            },
        },
    });
})();
