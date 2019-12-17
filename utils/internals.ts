import path from 'path';

/**
 * Generate HTML code for user profile.
 */
export function generateUserProfile(github: string) {
  const matched = github.match(/github.com\/(.+)\/(.+)/);
  if (!matched) {
    return '';
  }

  const user = matched[1];
  const avatarUrl = `/images/avatars/${user}.jpg`;
  const homepageUrl = `https://github.com/${user}`;

  return `<div class="profileBox">
  <div class="avatarBox">
    <a href="${homepageUrl}"><img src="${avatarUrl}" alt="" class="avatar"></a>
  </div>
  <div class="rightBox">
    <div class="infoBox">
    <a href="${homepageUrl}"><p class="nickName">@${user}</p></a>
  </div>
  <div class="codeBox">
    <a href="${github}"><span class="codeText">查看代码</span></a>
  </div>
  </div>
</div>`;
}

/**
 * Generate cover URI used in Tuture Hub.
 */
export function generateCoverURI(cover: string) {
  return `/images/covers/${path.parse(cover).base}`;
}
