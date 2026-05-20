# ui_pages

| Field            | Type        | Required | Mô tả                                                         |
| ---------------- | ----------- | -------- | ------------------------------------------------------------- |
| `id`             | uuid / ulid | yes      | Primary key                                                   |
| `key`            | string      | yes      | Unique stable identifier, ví dụ `dashboard`, `customers_page` |
| `title`          | string      | yes      | Tên page mặc định                                             |
| `translations`   | json        | no       | Dữ liệu đa ngôn ngữ cho `title`, `description`, breadcrumb    |
| `route`          | string      | yes      | Frontend route, ví dụ `/dashboard`                            |
| `page_type`      | enum        | yes      | Loại page renderer                                            |
| `component_key`  | string      | no       | Key component frontend dùng để render page custom             |
| `collection_key` | string      | no       | Collection được page quản lý, chỉ dùng cho collection page    |
| `layout`         | string      | no       | Layout shell, ví dụ `default`, `blank`, `settings`            |
| `props`          | json        | no       | Config truyền xuống page/component                            |
| `permissions`    | json        | no       | Role/user/feature access rules                                |
| `is_enabled`     | boolean     | yes      | Bật/tắt page                                                  |
| `is_system`      | boolean     | yes      | Page hệ thống, không nên cho user xoá/sửa key/route           |
