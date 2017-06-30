-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июн 30 2017 г., 23:30
-- Версия сервера: 5.5.35-1ubuntu1
-- Версия PHP: 5.5.9-1ubuntu4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `iw`
--

-- --------------------------------------------------------

--
-- Структура таблицы `iw_roles`
--

CREATE TABLE IF NOT EXISTS `iw_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `role` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `by_default` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 - Роль по умолчанию, 0 - Все остальные роли',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_E8DE9A457698A6A` (`role`),
  UNIQUE KEY `UNIQ_E8DE9A45E237E06` (`name`),
  KEY `IDX_E8DE9A43D8E604F` (`parent`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `iw_roles`
--

INSERT INTO `iw_roles` (`id`, `parent`, `role`, `by_default`, `name`, `deleted`, `created_at`, `updated_at`) VALUES
(7, NULL, 'ROLE_IW_USER', 1, 'ROLE_USER', 0, '2017-04-15 00:30:30', '2017-04-15 00:30:30');

-- --------------------------------------------------------

--
-- Структура таблицы `iw_users`
--

CREATE TABLE IF NOT EXISTS `iw_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_AC30628AF85E0677` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=43 ;

--
-- Дамп данных таблицы `iw_users`
--

INSERT INTO `iw_users` (`id`, `username`, `password`, `email`, `is_active`, `deleted`, `created_at`, `updated_at`) VALUES
(42, 'valery', 'sha1$e2c5c8ea$1$ab4ff3b0a0a65af6019637be76567f855ff34130', '1xvx1@mail.ru', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `iw_users_roles`
--

CREATE TABLE IF NOT EXISTS `iw_users_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_40968D6DA76ED395` (`user_id`),
  KEY `IDX_40968D6DD60322AC` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `iw_users_roles`
--

INSERT INTO `iw_users_roles` (`user_id`, `role_id`) VALUES
(42, 7);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `iw_roles`
--
ALTER TABLE `iw_roles`
  ADD CONSTRAINT `FK_E8DE9A43D8E604F` FOREIGN KEY (`parent`) REFERENCES `iw_roles` (`id`);

--
-- Ограничения внешнего ключа таблицы `iw_users_roles`
--
ALTER TABLE `iw_users_roles`
  ADD CONSTRAINT `FK_40968D6DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `iw_users` (`id`),
  ADD CONSTRAINT `FK_40968D6DD60322AC` FOREIGN KEY (`role_id`) REFERENCES `iw_roles` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
