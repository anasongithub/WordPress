<?php
// tests/unit/test-login.php
use PHPUnit\Framework\TestCase;

class LoginApiTest extends TestCase {
    public function test_login_page_returns_200() {
        $resp = @file_get_contents("http://localhost:8080/wp-login.php");
        $this->assertNotFalse($resp, "Failed to fetch wp-login.php");
    }
}
