create table users(
    id bigint generated always as identity primary key,
    username varchar(32) not null unique,
    password text not null,
    created_at timestamptz not null default current_timestamp
);
