<?php

use CriticalCssProcessor\CriticalCssProcessor;
use CSSFromHTMLExtractor\Twig\Extension;
use Doctrine\Common\Cache\ApcuCache;
use Silex\Application;
use Silex\Provider\HttpCacheServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Symfony\Component\HttpFoundation\Response;
use TwigWrapperProvider\TwigWrapperProvider;

$loader = include __DIR__.'/../vendor/autoload.php';

$app = new Application();

$debug = false;
$cacheTtl = 24 * 3600;
$cacheDirectory = __DIR__.'/../cache';

$app->register(
    new TwigServiceProvider(),
    [
        'twig.path' => [__DIR__.'/views', __DIR__],
        'twig.options' => [
            'debug' => $debug,
            'cache' => $cacheDirectory.'/twig_cache',
        ],
    ]
);

$app->register(new HttpCacheServiceProvider(), ['http_cache.cache_dir' => $cacheDirectory.'/http_cache']);

$app->register(new TwigWrapperProvider('twig', [new CriticalCssProcessor(new ApcuCache())]));

$app->extend(
    'twig',
    function (Twig_Environment $twig, $app) {
        $twig->addExtension(new Extension());

        return $twig;
    }
);


$app['debug'] = $debug;

$app->get(
    '/',
    function () use ($app, $cacheTtl) {
        return Response::create($app['twigwrapper']->render('index.twig'))->setTtl($cacheTtl);
    }
);
$app->get(
    '/without',
    function () use ($app, $cacheTtl) {
        return Response::create($app['twigwrapper']->render('without.twig'))->setTtl($cacheTtl);
    }
);
$app->get(
    '/with',
    function () use ($app, $cacheTtl) {
        return Response::create($app['twigwrapper']->render('with.twig'))->setTtl($cacheTtl);
    }
);

if ($debug) {
    $app->run();
} else {
    $app['http_cache']->run();
}

