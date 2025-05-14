-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 14, 2025 lúc 01:46 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `social_network`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `content`, `createdAt`, `updatedAt`, `userId`, `postId`, `likes`) VALUES
(1, 'hay2', '2025-05-14 02:46:26', '2025-05-14 02:46:26', 1, 2, 0),
(2, 'aa', '2025-05-14 03:00:27', '2025-05-14 03:00:27', 1, 2, 0),
(3, 'a', '2025-05-14 03:01:57', '2025-05-14 03:01:57', 2, 2, 0),
(4, 'ssssssss', '2025-05-14 03:19:41', '2025-05-14 03:19:41', 1, 3, 0),
(5, 'ssssss', '2025-05-14 03:19:43', '2025-05-14 03:19:43', 1, 3, 0),
(6, 'hay2', '2025-05-14 03:20:08', '2025-05-14 03:20:08', 2, 3, 0),
(7, 'aaa', '2025-05-14 05:43:43', '2025-05-14 05:43:43', 1, 3, 0),
(8, 'hehehehe', '2025-05-14 05:49:45', '2025-05-14 05:49:45', 1, 3, 0),
(9, 'hoaoaoaoaoaoaa', '2025-05-14 06:34:16', '2025-05-14 06:34:16', 1, 3, 0),
(10, 'hehe123', '2025-05-14 06:37:28', '2025-05-14 06:37:28', 1, 3, 0),
(11, 'HEEEE', '2025-05-14 06:38:32', '2025-05-14 06:38:32', 1, 3, 0),
(12, 'a', '2025-05-14 07:18:09', '2025-05-14 07:18:09', 1, 3, 0),
(13, 'hay2', '2025-05-14 07:28:20', '2025-05-14 11:24:54', 1, 3, 2),
(14, 'nice', '2025-05-14 11:13:35', '2025-05-14 11:13:37', 3, 4, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `follows`
--

CREATE TABLE `follows` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `followerId` int(11) DEFAULT NULL,
  `followingId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `follows`
--

INSERT INTO `follows` (`id`, `createdAt`, `updatedAt`, `followerId`, `followingId`) VALUES
(2, '2025-05-14 04:29:46', '2025-05-14 04:29:46', 1, 2),
(5, '2025-05-14 11:14:09', '2025-05-14 11:14:09', 3, 1),
(6, '2025-05-14 11:14:10', '2025-05-14 11:14:10', 3, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `likes`
--

INSERT INTO `likes` (`id`, `createdAt`, `updatedAt`, `userId`, `postId`, `commentId`) VALUES
(3, '2025-05-14 03:01:54', '2025-05-14 03:01:54', 2, 2, NULL),
(8, '2025-05-14 09:01:12', '2025-05-14 09:01:12', 1, NULL, 13),
(9, '2025-05-14 10:51:36', '2025-05-14 10:51:36', 3, 3, NULL),
(10, '2025-05-14 10:51:44', '2025-05-14 10:51:44', 3, 2, NULL),
(11, '2025-05-14 11:13:30', '2025-05-14 11:13:30', 3, 4, NULL),
(12, '2025-05-14 11:13:37', '2025-05-14 11:13:37', 3, NULL, 14),
(13, '2025-05-14 11:24:54', '2025-05-14 11:24:54', 4, NULL, 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `relatedUserId` int(11) DEFAULT NULL,
  `relatedPostId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `isRead`, `createdAt`, `updatedAt`, `userId`, `relatedUserId`, `relatedPostId`) VALUES
(1, 'like', 0, '2025-05-14 02:32:31', '2025-05-14 02:32:31', 1, 1, 2),
(2, 'like', 0, '2025-05-14 02:32:41', '2025-05-14 02:32:41', 1, 1, 2),
(3, 'comment', 1, '2025-05-14 02:46:26', '2025-05-14 07:15:59', 1, 1, 2),
(4, 'comment', 0, '2025-05-14 03:00:27', '2025-05-14 03:00:27', 1, 1, 2),
(5, 'like', 0, '2025-05-14 03:01:54', '2025-05-14 03:01:54', 1, 2, 2),
(6, 'comment', 0, '2025-05-14 03:01:57', '2025-05-14 03:01:57', 1, 2, 2),
(7, 'like', 0, '2025-05-14 03:19:36', '2025-05-14 03:19:36', 2, 1, 3),
(8, 'comment', 0, '2025-05-14 03:19:41', '2025-05-14 03:19:41', 2, 1, 3),
(9, 'comment', 0, '2025-05-14 03:19:43', '2025-05-14 03:19:43', 2, 1, 3),
(10, 'recommend', 0, '2025-05-14 03:19:57', '2025-05-14 03:19:57', 1, 2, 2),
(11, 'comment', 0, '2025-05-14 03:20:08', '2025-05-14 03:20:08', 2, 2, 3),
(12, 'follow', 0, '2025-05-14 04:12:07', '2025-05-14 04:12:07', 2, 1, NULL),
(13, 'follow', 0, '2025-05-14 04:29:46', '2025-05-14 04:29:46', 2, 1, NULL),
(14, 'comment', 0, '2025-05-14 05:43:43', '2025-05-14 05:43:43', 2, 1, 3),
(15, 'like', 0, '2025-05-14 05:48:25', '2025-05-14 05:48:25', 2, 1, 3),
(16, 'comment', 0, '2025-05-14 05:49:45', '2025-05-14 05:49:45', 2, 1, 3),
(17, 'like', 0, '2025-05-14 06:31:53', '2025-05-14 06:31:53', 2, 1, 3),
(18, 'comment', 0, '2025-05-14 06:34:16', '2025-05-14 06:34:16', 2, 1, 3),
(19, 'comment', 0, '2025-05-14 06:37:28', '2025-05-14 06:37:28', 2, 1, 3),
(20, 'comment', 0, '2025-05-14 06:38:32', '2025-05-14 06:38:32', 2, 1, 3),
(21, 'comment', 0, '2025-05-14 07:18:09', '2025-05-14 07:18:09', 2, 1, 3),
(22, 'comment', 0, '2025-05-14 07:28:20', '2025-05-14 07:28:20', 2, 1, 3),
(23, 'like', 0, '2025-05-14 10:51:36', '2025-05-14 10:51:36', 2, 3, 3),
(24, 'like', 0, '2025-05-14 10:51:44', '2025-05-14 10:51:44', 1, 3, 2),
(25, 'recommend', 0, '2025-05-14 10:54:03', '2025-05-14 10:54:03', 2, 3, 3),
(26, 'follow', 0, '2025-05-14 10:55:02', '2025-05-14 10:55:02', 2, 3, NULL),
(27, 'follow', 0, '2025-05-14 10:55:06', '2025-05-14 10:55:06', 2, 3, NULL),
(28, 'follow', 0, '2025-05-14 11:14:09', '2025-05-14 11:14:09', 1, 3, NULL),
(29, 'follow', 0, '2025-05-14 11:14:10', '2025-05-14 11:14:10', 2, 3, NULL),
(30, 'like_comment', 0, '2025-05-14 11:24:54', '2025-05-14 11:24:54', 1, 4, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `content`, `image`, `createdAt`, `updatedAt`, `userId`, `likes`) VALUES
(2, 'My Dog', '/uploads/1747189946841.jpg', '2025-05-14 02:32:26', '2025-05-14 10:51:44', 1, 1),
(3, 'Hehehe my dog s', NULL, '2025-05-14 03:02:48', '2025-05-14 10:51:36', 2, 1),
(4, 'My class', '/uploads/1747221195262.jpg', '2025-05-14 11:13:15', '2025-05-14 11:13:30', 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profileTag` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `coverPicture` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `profileTag`, `bio`, `profilePicture`, `coverPicture`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'khanhaovl18@gmail.com', '$2b$10$XAVKjsG4md63khQER75o4egPoFxsm.rpy.Iju.CDslfkoHHDG/pIy', '@khanh', 'admin', '/uploads/1747201431678.jpg', NULL, '2025-05-14 02:31:05', '2025-05-14 05:58:59'),
(2, 'thuthu', 'test1@gmail.com', '$2b$10$vFePfuYxSbzU0.pDwYT9i.SXcJosu2emvfSXLd8OmvZyCAF4Ih5D2', 'thuthu', NULL, '/uploads/1747191764388.png', NULL, '2025-05-14 03:01:50', '2025-05-14 03:02:44'),
(3, 'test2', 'test2@gmail.com', '$2b$10$krPPqB/hb3Lvk7/Kd.ug3ebklS8zPLRRav74sT4tvnGCm5OIiEAdK', '@test2', 'admin', '/uploads/1747221343630.jpg', NULL, '2025-05-14 10:51:27', '2025-05-14 11:15:43'),
(4, 'test3', 'test3@gmail.com', '$2b$10$ntGvK4HEpXN3brmHl3ommulytqZybbvSYoFEmxU7fgHYnTl0.tNPm', '@test3', NULL, NULL, NULL, '2025-05-14 11:16:36', '2025-05-14 11:16:36');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Chỉ mục cho bảng `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `followerId` (`followerId`),
  ADD KEY `followingId` (`followingId`);

--
-- Chỉ mục cho bảng `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `relatedUserId` (`relatedUserId`),
  ADD KEY `relatedPostId` (`relatedPostId`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`followerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followingId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`relatedUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`relatedPostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
