<?php
// tests/api/test-posts.php
use PHPUnit\Framework\TestCase;

class PostsApiTest extends TestCase {
    public function test_get_posts_api() {
        $resp = @file_get_contents("http://localhost:8080/wp-json/wp/v2/posts");
        $this->assertNotFalse($resp, "Failed to fetch posts API");
        $data = json_decode($resp, true);
        $this->assertIsArray($data, "Expected JSON array from posts endpoint");
    }
}
