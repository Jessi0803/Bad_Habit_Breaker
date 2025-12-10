// Clerk Configuration for Chrome Extension
// Habit Breaker - User Authentication with Clerk

/**
 * Clerk 設定指南
 * 
 * 1. 前往 https://dashboard.clerk.com/
 * 2. 創建新應用 (Create Application)
 * 3. 選擇 "Chrome Extension" 作為應用類型
 * 4. 複製 Publishable Key
 * 5. 將 Key 貼到下面的 CLERK_PUBLISHABLE_KEY
 */

// ✅ Clerk Key 已設定
const CLERK_PUBLISHABLE_KEY = 'pk_test_YWJzb2x1dGUtcm9kZW50LTY0LmNsZXJrLmFjY291bnRzLmRldiQ';

// Clerk 配置
const CLERK_CONFIG = {
  publishableKey: CLERK_PUBLISHABLE_KEY,
  
  // Frontend API URL
  frontendApi: 'absolute-rodent-64.clerk.accounts.dev',
  
  // Sign in/up redirect URLs
  signInUrl: chrome.runtime.getURL('signin.html'),
  signUpUrl: chrome.runtime.getURL('signup.html'),
  
  // 支援的登入方式
  signInMethods: ['email', 'google', 'github'],
  
  // Session 配置
  session: {
    refreshInterval: 60000, // 60秒刷新一次
    maxAge: 86400000 // 24小時過期
  }
};

/**
 * 簡化的 Clerk 整合（不需要完整 SDK）
 * 使用 Clerk 的 Frontend API 直接呼叫
 */
class ClerkAuth {
  constructor(config) {
    this.config = config;
    this.session = null;
    this.user = null;
  }
  
  /**
   * 初始化 Clerk 並檢查現有 session
   */
  async init() {
    try {
      // 從 storage 讀取 session token
      const data = await chrome.storage.local.get(['clerk_session_token', 'clerk_user']);
      
      if (data.clerk_session_token) {
        this.session = { token: data.clerk_session_token };
        this.user = data.clerk_user;
        
        // 驗證 session 是否仍然有效
        const isValid = await this.verifySession(this.session.token);
        if (!isValid) {
          await this.signOut();
        }
      }
      
      return this.isSignedIn();
    } catch (error) {
      console.error('Clerk init error:', error);
      return false;
    }
  }
  
  /**
   * 檢查用戶是否已登入
   */
  isSignedIn() {
    return !!(this.session && this.user);
  }
  
  /**
   * 獲取當前用戶
   */
  getUser() {
    return this.user;
  }
  
  /**
   * 使用 Email/Password 登入
   */
  async signIn(email, password) {
    try {
      // 方案 A: 使用 Clerk Frontend API
      const response = await fetch(`https://${this.config.frontendApi}/v1/client/sign_ins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
          strategy: 'password'
        })
      });
      
      if (!response.ok) {
        throw new Error('Sign in failed');
      }
      
      const data = await response.json();
      
      // 儲存 session 和用戶資訊
      this.session = data.client.sessions[0];
      this.user = data.client.sessions[0].user;
      
      await chrome.storage.local.set({
        clerk_session_token: this.session.id,
        clerk_user: this.user
      });
      
      // 同步到 sync storage
      await chrome.storage.sync.set({
        userEmail: this.user.primary_email_address.email_address,
        clerkUserId: this.user.id,
        userName: this.user.first_name || 'User'
      });
      
      return this.user;
    } catch (error) {
      console.error('Clerk sign in error:', error);
      throw error;
    }
  }
  
  /**
   * 使用 OAuth 登入 (Google/GitHub)
   */
  async signInWithOAuth(provider = 'google') {
    try {
      // 打開 OAuth 登入視窗
      const oauthUrl = `https://${this.config.frontendApi}/v1/oauth_callback`;
      
      // Chrome Extension 中使用 chrome.identity API
      // 黑客松時可以簡化為打開新 tab
      chrome.tabs.create({
        url: `https://${this.config.frontendApi}/v1/oauth/${provider}`,
        active: true
      });
      
      // 監聽 OAuth callback
      // 實際整合時需要設定 redirect URL 並監聽
      
      return true;
    } catch (error) {
      console.error('OAuth sign in error:', error);
      throw error;
    }
  }
  
  /**
   * 註冊新用戶
   */
  async signUp(email, password, firstName, lastName) {
    try {
      const response = await fetch(`https://${this.config.frontendApi}/v1/client/sign_ups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          password: password,
          first_name: firstName,
          last_name: lastName
        })
      });
      
      if (!response.ok) {
        throw new Error('Sign up failed');
      }
      
      const data = await response.json();
      
      // 註冊後自動登入
      return await this.signIn(email, password);
    } catch (error) {
      console.error('Clerk sign up error:', error);
      throw error;
    }
  }
  
  /**
   * 登出
   */
  async signOut() {
    try {
      // 清除本地 session
      await chrome.storage.local.remove(['clerk_session_token', 'clerk_user']);
      await chrome.storage.sync.remove(['userEmail', 'clerkUserId', 'userName']);
      
      this.session = null;
      this.user = null;
      
      return true;
    } catch (error) {
      console.error('Clerk sign out error:', error);
      throw error;
    }
  }
  
  /**
   * 驗證 session 是否有效
   */
  async verifySession(sessionToken) {
    try {
      // 簡化版：檢查 token 是否存在
      // 實際應該呼叫 Clerk API 驗證
      return !!sessionToken;
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  }
  
  /**
   * 更新用戶資訊
   */
  async updateUser(updates) {
    try {
      // 更新本地用戶資訊
      this.user = { ...this.user, ...updates };
      
      await chrome.storage.local.set({
        clerk_user: this.user
      });
      
      return this.user;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }
}

// 導出單例
const clerkAuth = new ClerkAuth(CLERK_CONFIG);

// 使用方式說明
/*
使用範例：

// 1. 初始化
await clerkAuth.init();

// 2. 檢查登入狀態
if (clerkAuth.isSignedIn()) {
  const user = clerkAuth.getUser();
  console.log('User:', user);
}

// 3. 登入
try {
  const user = await clerkAuth.signIn('email@example.com', 'password');
  console.log('Logged in:', user);
} catch (error) {
  console.error('Login failed:', error);
}

// 4. OAuth 登入
await clerkAuth.signInWithOAuth('google');

// 5. 註冊
await clerkAuth.signUp('email@example.com', 'password', 'John', 'Doe');

// 6. 登出
await clerkAuth.signOut();
*/

