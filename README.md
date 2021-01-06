# if-hex-viewer

hex viewer with the ability to listen for udp traffic. Project created for private use.

![screenshot](https://github.com/knobik/if-hex-viewer/blob/master/screenshot.png?raw=true)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

# Example udp sender class (PHP)

```php
<?php

namespace App\Utils;


/**
 * Class Debug
 */
class Debug
{
    private const SIMPLE_PAYLOAD = 0x01;
    private const EXTENDED_PAYLOAD = 0x02;

    /**
     * @var array
     */
    protected array $payload;

    /**
     * Debug constructor.
     * @param  array  $payload
     */
    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    /**
     * @param  array  $payload
     * @return static
     */
    public static function simple(array $payload): Debug
    {
        array_unshift($payload, static::SIMPLE_PAYLOAD);

        return new static($payload);
    }

    /**
     * @param $name
     * @param  array  $payload
     * @return Debug
     */
    public static function extended($name, array $payload): Debug
    {
        $meta = [
            'name' => $name
        ];

        $metaUnpacked = unpack('C*', json_encode($meta, JSON_THROW_ON_ERROR, 512));
        $metaUnpacked[] = 0; // null terminator

        array_unshift(
            $payload,
            static::EXTENDED_PAYLOAD,
            ...$metaUnpacked
        );

        return new static($payload);
    }

    /**
     * @return void
     */
    public function send(): void
    {
        $sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
        socket_sendto(
            $sock,
            pack('C*', ...$this->payload),
            count($this->payload),
            0,
            $_SERVER['DOCKER_HOST'] ?? 'localhost',
            4321
        );
        socket_close($sock);
    }
}
```

### Example usage
```php
    /**
     * @param  string|null  $name
     * @return void
     */
    public function debug(?string $name = null): void
    {
        $buffer = $this->toBytes(); // byte (unsigned int) 0..255

        if ($name) {
            $debug = Debug::extended($name, $buffer);
        } else {
            $debug = Debug::simple($buffer);
        }

        $debug->send();
    }
```
