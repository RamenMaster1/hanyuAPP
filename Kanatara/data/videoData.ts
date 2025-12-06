// src/data/videoData.ts

export const videoList = [
  {
    day: 1,
    title: "第1天 | 不受欢迎vs受欢迎的女生在学校的区别",
    // 新增字段
    cover: "/images/cover1.png", // 请确保 public/images/ 下有此图片
    level: "中高级",
    originUrl: "https://www.youtube.com/watch?v=KG3X8hqWwgI",

    fullVideo: "/VEDIO/1.mp4",
    segment: "/VEDIO/1.1.mp4",
    sentences: [
      {
        korean: `내가 진짜 <span class="text-blue-600">황당한 일</span>을 <span class="text-purple-600">겪었거든</span>`,
        chinese: `我真的经历过一件<span class="text-blue-600 font-bold">荒唐的事</span>`,
        words: ["황당한 일", "겪다", "-거든"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">황당한 일</span><br/>
              황당하다: 形容词<br/>
              <span class="text-blue-500">황당하 + 定语词尾ㄴ + 事情일 → 荒唐的事</span>
            </li>
            <li>
              <span class="font-bold text-purple-600">겪었거든</span><br/>
              读作: [겨껃꺼든]<br/>
              겪다: 经历 (他动词)<br/>
              经历心理斗争: 갈등을 겪다<br/>
              <span class="text-purple-500">-거든(요)</span><br/>
              1. 解释、强调原因，“因为……”<br/>
              2. 先说结论，再补充说明，“其实……”、“我告诉你吧……”<br/>
              3. 表示命令、劝告、提醒，“要知道……”
            </li>
          </ul>
        `
      },
      {
        korean: `온리 내 몸 <span class="text-purple-600">때문에</span>`,
        chinese: `只是<span class="text-purple-600 font-bold">因为</span>我的身体（外貌）`,
        words: ["온리", "때문에"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">온리</span><br/>
              读作[올리] 流音化，来自英语的 “only”
            </li>
            <li>
              <span class="font-bold text-purple-600">때문에</span><br/>
              名词+때문에：表示原因（记得名词后面要空格哦~）
            </li>
          </ul>
        `
      },
      {
        korean: `길을 가고 <span class="text-blue-600">있는데</span>`,
        chinese: `正走着<span class="text-blue-600 font-bold">呢</span>`,
        words: ["길을", "-고 있다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">을/를</span><br/>
              在这里不是提示他动词的宾语，而是提示离开、经过的场所。
            </li>
            <li>
              <span class="font-bold text-blue-600">있는데</span><br/>
              读作[인는데] 鼻音化<br/>
              는데：表示铺垫，为后面的内容讲一个背景
            </li>
          </ul>
        `
      },
      {
        korean: `앞에서 남학생 세 명이 <span class="text-blue-600">되게...</span>`,
        chinese: `前面有三个男生，<span class="text-blue-600 font-bold">很……</span>`,
        words: ["남학생", "되게"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">되게</span><br/>
              口语中常用的表达，“很、非常”
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">지들끼리 막</span> <span class="text-purple-600">욕하면서</span> 소리 <span class="text-purple-600">빽빽 지르면서</span> 이렇게 <span class="text-orange-500">지나가고 있는</span> 거야`,
        chinese: `他们边骂边大声叫嚷着走过来`,
        words: ["지들끼리", "욕하다", "지르다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">지들끼리 막</span><br/>
              他们之间 (=자기들끼리)<br/>
              끼리: “……们之间” (among)<br/>
              막: 马上、刚、随便，特别常见于给别人讲述发生的事情的时候
            </li>
            <li>
              <span class="font-bold text-purple-600">욕하면서</span><br/>
              读作 [요카면서] 送气音化<br/>
              动词词干+(으)면서：一边……一边……<br/>
              빽빽: 哇哇、嗷嗷叫 (副词)
            </li>
            <li>
                <span class="font-bold text-purple-600">지르면서</span><br/>
                지르다 喊叫 (他动词)
            </li>
            <li>
              <span class="font-bold text-orange-500">지나가고 있는</span><br/>
              지나가고: 지나가다 路过 (自动词)<br/>
              动词词干+고 있다：表示动作正在进行
            </li>
          </ul>
        `
      },
      {
        korean: `이렇게 이렇게 <span class="text-blue-600">바닥</span> 보면서 <span class="text-purple-600">걷고</span> 있었어`,
        chinese: `我就这样边看<span class="text-blue-600 font-bold">地面</span>边走着路`,
        words: ["바닥", "걷다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">바닥</span><br/>
              地面 (名词)
            </li>
            <li>
              <span class="font-bold text-purple-600">걷고</span><br/>
              读作 [걷꼬] 紧音化
            </li>
          </ul>
        `
      },
      {
        korean: `나랑 이렇게 <span class="text-blue-600">마주치는 상황</span><span class="text-purple-600">이었</span><span class="text-orange-500">단 말이야</span>`,
        chinese: `<span class="text-orange-500 font-bold">就是说</span>是和我<span class="text-blue-600 font-bold">迎面走来的情况</span>`,
        words: ["마주치다", "-단 말이야"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">마주치는 상황</span><br/>
              마주치다: 相遇、正面相遇、对视 (动词) TOPIK中级词汇
            </li>
            <li>
              <span class="font-bold text-purple-600">이었</span><br/>
              이다：“是”<br/>
              把다去掉+过去时制词尾었
            </li>
            <li>
              <span class="font-bold text-orange-500">단 말이야</span><br/>
              ~다는 말이다 的缩写，“就是、就是说……”<br/>
              <span class="text-orange-500">因为这个语法功能不好解释，所以我们记住使用情况：</span><br/>
              1. 不耐烦、着急解释<br/>
              2. 诉苦、抱怨
            </li>
          </ul>
        `
      },
      {
        korean: `남학생들이 막 <span class="text-blue-600">시끄럽다가</span> 한 명이 나를 이렇게 보더니`,
        chinese: `男学生们<span class="text-blue-600 font-bold">正吵闹着，然后突然</span>（其中）一个人这样看我`,
        words: ["시끄럽다", "-다가", "-더니"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">시끄럽다가</span><br/>
              시끄럽다 吵闹 (形容词) TOPIK初级<br/>
              다가：表示动作或状态的转变，“正在……时突然……”<br/>
              <span class="text-blue-500">例句：걷다가 넘어졌어요. 走着走着，摔倒了。</span>
            </li>
          </ul>
        `
      },
      {
        korean: `"야, 야" 하는 거야`,
        chinese: `说“喂！喂！”`,
        words: ["야"],
        note: `模拟当时说话的语气。`
      },
      {
        korean: `나랑 <span class="text-blue-600">가까워질수록</span> 애들이 조용한 거야`,
        chinese: `然后他们和我<span class="text-blue-600 font-bold">变得越近就越</span>安静`,
        words: ["가깝다", "-아/어지다", "-(으)ㄹ 수록"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">가까워질수록</span><br/>
              가깝다 近 (形容词) [가깝따]<br/>
              아/어/여 지다: 变得……<br/>
              가까워지다 变近<br/>
              ㄹ/을 수록：越……，越……
            </li>
          </ul>
        `
      },
      {
        korean: `근데 어떤 한 <span class="text-blue-600">남자애</span>가 <span class="text-purple-600">코로</span> <span class="text-orange-500">돼지 소리를 내는</span> 거지`,
        chinese: `结果其中一个<span class="text-blue-600 font-bold">男孩子</span><span class="text-purple-600 font-bold">用鼻子</span><span class="text-orange-500 font-bold">发出猪叫</span>`,
        words: ["남자애", "(으)로", "돼지"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
              <li>
                <span class="font-bold text-blue-600">남자애</span><br/>
                男孩子 (名词)
              </li>
              <li>
                <span class="font-bold text-purple-600">코로</span><br/>
                <span class="text-purple-500">(으)로: 提示方式方法手段工具原材料，在这里翻译成“用”</span>
                <div class="mt-2 p-3 bg-slate-50 rounded border text-sm">
                  👇 <strong>接续规则如下：</strong>
                  <table class="w-full mt-2 text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-200">
                        <th class="py-1">词尾情况</th>
                        <th class="py-1">形式</th>
                        <th class="py-1">例子</th>
                      </tr>
                    </thead>
                    <tbody class="text-slate-600">
                      <tr class="border-b border-slate-100">
                        <td class="py-2">元音结尾</td>
                        <td class="font-mono font-bold">-로</td>
                        <td>나무 → 나무로 (用木头)</td>
                      </tr>
                      <tr class="border-b border-slate-100">
                        <td class="py-2">辅音结尾</td>
                        <td class="font-mono font-bold">-으로</td>
                        <td>손 → 손으로 (用手)</td>
                      </tr>
                        <tr>
                        <td class="py-2">"ㄹ"结尾</td>
                        <td class="font-mono font-bold">-로</td>
                        <td>칼 → 칼로 (用刀)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
              <li>
                <span class="font-bold text-orange-500">돼지 소리를 내는</span><br/>
                돼지: 猪 (名词)<br/>
                소리를 내다: 发出声音
              </li>
          </ul>
        `
      },
      {
        korean: `그래서 내가 "어?" 나는 <span class="text-blue-600">나한테</span> 그런 <span class="text-purple-600">줄 몰랐어</span>`,
        chinese: `所以我当时（心想）“嗯？”，我<span class="text-purple-600 font-bold">不知道</span>是在<span class="text-blue-600 font-bold">对</span>我那样做`,
        words: ["-한테", "-(으)ㄴ 줄 몰랐다"],
        note: `
            <ul class="list-disc pl-5 space-y-3">
              <li>
                <span class="font-bold text-blue-600">한테</span><br/>
                -한테= “对…… / 向…… / 给……”<br/>
                <span class="text-blue-500">用于表示动作的对象或动作发生的方向。</span><br/>
                相当于中文的 “给 / 向 / 被 / 对”。
              </li>
              <li>
                <span class="font-bold text-purple-600">줄 몰랐어</span><br/>
                줄 몰랐다：表示“以为不是 / 没想到”。
              </li>
            </ul>
        `
      },
      {
        korean: `그냥 지들끼리 <span class="text-blue-600">노는</span> 건 <span class="text-purple-600">줄 알았어</span>`,
        chinese: `<span class="text-purple-600 font-bold">以为</span>他们只是自己闹着<span class="text-blue-600 font-bold">玩</span>`,
        words: ["놀다", "-(으)ㄴ 줄 알았다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
              <li>
                <span class="font-bold text-blue-600">노는</span><br/>
                놀다: 玩 (动词) TOPIK初级
              </li>
              <li>
                <span class="font-bold text-purple-600">건 줄 알았어</span><br/>
                “–(으)ㄴ/는 줄 알았다” = 以为……（但其实不是）<br/>
                👉 <span class="text-purple-500">表示说话人对过去某件事的误解或错误判断。</span><br/>
                前半句是误以为的内容，后半句（有时省略）则暗含“但其实不是那样”。<br/>
                <div class="mt-2 p-3 bg-slate-50 rounded border text-sm">
                  <table class="w-full mt-1 text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-200">
                        <th class="py-1">时态</th>
                        <th class="py-1">接续形式</th>
                        <th class="py-1">含义</th>
                      </tr>
                    </thead>
                    <tbody class="text-slate-600">
                      <tr class="border-b border-slate-100">
                        <td class="py-2">现在</td>
                        <td class="font-mono">-는 줄 알았다</td>
                        <td>以为他在睡觉</td>
                      </tr>
                      <tr class="border-b border-slate-100">
                        <td class="py-2">过去</td>
                        <td class="font-mono">-(으)ㄴ 줄 알았다</td>
                        <td>以为他睡过了</td>
                      </tr>
                        <tr class="border-b border-slate-100">
                        <td class="py-2">将来</td>
                        <td class="font-mono">-(으)ㄹ 줄 알았다</td>
                        <td>以为他会来</td>
                      </tr>
                      <tr>
                        <td class="py-2">否定</td>
                        <td class="font-mono">-지 않은 줄 알았다</td>
                        <td>以为他没来</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
          </ul>
        `
      },
    ],
  },
  // src/data/videoData.ts 
// ... 接在第1天的数据后面 ...

  {
    day: 2,
    title: "第2天 | 假装回到10岁给妈妈打电话",

    // 新增字段
    cover: "/images/cover2.png", // 请确保 public/images/ 下有此图片
    level: "中高级",
    originUrl: "https://www.youtube.com/watch?v=jav4CmzFaYg", // 示例链接

    fullVideo: "/VEDIO/2.mp4", // 请确认实际文件名
    segment: "/VEDIO/2.1.mp4", // 请确认实际文件名
    sentences: [
      {
        korean: `내가 어제 엄마가 혼자 화장실에서 <span class="text-blue-600">우는 거</span> <span class="text-purple-600">봤는데</span>,`,
        chinese: `我昨天<span class="text-purple-600 font-bold">看到</span>妈妈一个人在厕所里<span class="text-blue-600 font-bold">哭</span>，`,
        words: ["우는 거", "-는데", "혼자", "화장실"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">우는 거</span><br/>
              울다(哭) + -는 거 → “哭这件事” (动词名词化)
            </li>
            <li>
              <span class="font-bold text-purple-600">봤는데</span><br/>
              보다(看) + -는데<br/>
              -는데: 表示前后句的背景铺垫或转折，“看到……然后/但是……”
            </li>
            <li>
              <span class="font-bold">혼자</span>: 一个人
            </li>
            <li>
              <span class="font-bold">화장실에서</span>: 在厕所里 (-에서 表示场所)
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">두려워서</span> 그... <span class="text-purple-600">그냥</span> <span class="text-orange-500">도망쳤어</span>. 미안해.`,
        chinese: `<span class="text-blue-600 font-bold">因为害怕</span>得……<span class="text-purple-600 font-bold">就那样</span><span class="text-orange-500 font-bold">逃走了</span>。对不起。`,
        words: ["두렵다", "그냥", "도망치다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">두려워서</span><br/>
              두렵다(害怕) → 두려워서<br/>
              -아/어/여서: 表示原因，“因为害怕，所以……”
            </li>
            <li>
              <span class="font-bold text-purple-600">그냥</span><br/>
              就那样、就
            </li>
            <li>
              <span class="font-bold text-orange-500">도망쳤어</span><br/>
              도망치다: 逃跑、逃走 (过去式)
            </li>
          </ul>
        `
      },
      {
        korean: `엄마가 <span class="text-purple-600">거기서</span> <span class="text-blue-600">울고 있었어?</span>`,
        chinese: `妈妈当时<span class="text-purple-600 font-bold">在那里</span><span class="text-blue-600 font-bold">哭吗？</span>`,
        words: ["-고 있다", "거기서"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">울고 있었어</span><br/>
              -고 있었어: 过去进行时，“(当时)正在……中”
            </li>
            <li>
              <span class="font-bold text-purple-600">거기서</span><br/>
              在那里。<br/>
              是 거기에서 的缩略形式，口语中经常这样缩略。
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">왜 그랬을까...?</span>`,
        chinese: `<span class="text-blue-600 font-bold">为什么会那样呢？</span>`,
        words: ["그랬을까"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">그랬을까</span><br/>
              原形是 그렇다 (形容词，“那样的”)。<br/>
              遇到元音开头的词尾，ㅎ脱落。<br/>
              -았/었을까: 表示过去的推测或自问，“是不是……了呢？”
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">그랬나?</span>`,
        chinese: `<span class="text-blue-600 font-bold">是那样吗？</span>`,
        words: ["그랬나"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">그랬나</span><br/>
              原形同上，也是 그렇다。<br/>
              表示轻微确认或自我回忆，“我那样了吗？”
            </li>
          </ul>
        `
      },
      {
        korean: `엄마는 <span class="text-blue-600">일하면서</span> 힘들지 않아?`,
        chinese: `妈妈<span class="text-blue-600 font-bold">一边工作</span>（一边带我们）不辛苦吗？`,
        words: ["일하면서", "힘들다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">일하면서</span><br/>
              发生ㅎ的弱化，读作 [이라면서]<br/>
              -면서: 表示同时进行，“一边……一边……”<br/>
              这里表示“一边工作…… (一边带我们)”
            </li>
            <li>
              <span class="font-bold">힘들다</span>: 辛苦、累
            </li>
          </ul>
        `
      },
      {
        korean: `아빠 <span class="text-blue-600">없이</span>`,
        chinese: `<span class="text-blue-600 font-bold">没有</span>爸爸的情况下，`,
        words: ["없이"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">없이</span><br/>
              没有、缺乏 (名词 + 없이)
            </li>
          </ul>
        `
      },
      {
        korean: `아침에 너희들 <span class="text-blue-600">챙겨서</span> 유치원 <span class="text-purple-600">보내고</span> 학교 보내고 많이 <span class="text-orange-500">힘들었지</span>.`,
        chinese: `早上<span class="text-blue-600 font-bold">照顾</span>你们，<span class="text-purple-600 font-bold">送</span>你们去幼儿园、去学校，真的很<span class="text-orange-500 font-bold">辛苦吧</span>。`,
        words: ["챙기다", "보내다", "-었지"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">챙겨서</span><br/>
              챙기다: 照顾、准备好<br/>
              -아서/어서: “做完A又做B”，有紧密关联的动作相继发生。
            </li>
            <li>
              <span class="font-bold text-purple-600">보내고</span><br/>
              보내다: 送 (人) 去某地
            </li>
            <li>
              <span class="font-bold text-orange-500">힘들었지</span><br/>
              -었지: 回忆、确认语气，常用于温柔语气中。
            </li>
          </ul>
        `
      },
      {
        korean: `그런데, 너희들이 엄마 힘들어 하는 거 <span class="text-blue-600">알고서</span> 너희들 생활 열심히 <span class="text-purple-600">해주는 거</span>`,
        chinese: `但是，你们<span class="text-blue-600 font-bold">知道后</span>妈妈很辛苦，还那么努力地<span class="text-purple-600 font-bold">生活</span>（为妈妈努力），`,
        words: ["알고서", "해주다", "-는 거"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">알고서</span><br/>
              知道后 (-고서 表示前后动作顺序，延世韩国语第3册第4单元语法4)
            </li>
            <li>
              <span class="font-bold text-purple-600">열심히 해주는 거</span><br/>
              열심히 해주다: 努力地为别人做 (“为妈妈努力生活”)<br/>
              -는 거: 动词名词化，“……这件事”
            </li>
          </ul>
        `
      },
      {
        korean: `그거 봐도 힘들었던 거 다 <span class="text-blue-600">잊어버리고</span> <span class="text-purple-600">견뎌낼 수 있었어</span>.`,
        chinese: `看到这些，妈妈就能把所有的辛苦都<span class="text-blue-600 font-bold">彻底忘掉</span>，<span class="text-purple-600 font-bold">坚持下去了</span>。`,
        words: ["잊어버리다", "견뎌내다", "-(으)ㄹ 수 있다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold">힘들었던 거</span>: “辛苦过的事”
            </li>
            <li>
              <span class="font-bold text-blue-600">잊어버리고</span><br/>
              잊어버리다: 彻底忘掉<br/>
              -고: 连接动作，“……然后……”
            </li>
            <li>
              <span class="font-bold text-purple-600">견뎌낼 수 있었어</span><br/>
              견뎌내다: 坚持、忍耐过去<br/>
              -을 수 있었다: 表示过去能力，“能够……”
            </li>
          </ul>
        `
      },
      {
        korean: `그럼...어제 엄마 어떤 이유 <span class="text-blue-600">때문에</span> <span class="text-purple-600">울었어</span>?`,
        chinese: `那么……昨天妈妈是因为什么原因<span class="text-blue-600 font-bold">因为</span><span class="text-purple-600 font-bold">哭</span>的呢？`,
        words: ["때문에", "-었어"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">명사(名词) + 때문에</span><br/>
              因为……
            </li>
            <li>
              <span class="font-bold text-purple-600">-었어</span><br/>
              过去时，口语体
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">정확하게</span> 잘 <span class="text-purple-600">기억은 안 나는데</span>`,
        chinese: `虽然<span class="text-blue-600 font-bold">准确地</span>记<span class="text-purple-600 font-bold">得不是很清楚</span>，`,
        words: ["정확하게", "기억이 안 나다", "-는데"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">정확하게</span><br/>
              准确地。原形为정확하다 (形容词，“准确的”)
            </li>
            <li>
              <span class="font-bold text-purple-600">기억(이) 안 나다</span><br/>
              想不起来
            </li>
            <li>
              <span class="font-bold">-는데</span>: 表示铺垫或转折
            </li>
          </ul>
        `
      },
      {
        korean: `아마도 엄마하고 아빠 <span class="text-blue-600">의견 충돌</span>이 <span class="text-purple-600">있었나</span>?`,
        chinese: `也许妈妈和爸爸之间有<span class="text-blue-600 font-bold">意见冲突</span><span class="text-purple-600 font-bold">吗</span>？`,
        words: ["아마도", "의견 충돌", "-었나"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold">아마도</span>: 表示推测，“可能、大概”
            </li>
            <li>
              <span class="font-bold text-blue-600">의견 충돌</span><br/>
              意见冲突 (名词)
            </li>
            <li>
              <span class="font-bold text-purple-600">-었나?</span><br/>
              过去式自问语气
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">그랬을 거야.</span>`,
        chinese: `<span class="text-blue-600 font-bold">应该是那样吧。</span>`,
        words: ["-았/었을 거야"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">-았/었을 거야</span><br/>
              表示推测，“应该……了”
            </li>
          </ul>
        `
      },
      {
        korean: `<span class="text-blue-600">주말부부라</span> 떨어져 <span class="text-purple-600">있다 보니까</span>`,
        chinese: `因为是<span class="text-blue-600 font-bold">周末夫妻</span>分开住，`,
        words: ["주말부부", "-(이)라", "-다 보니까"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold text-blue-600">주말부부</span><br/>
              周末夫妻 (只在周末见面)
            </li>
            <li>
              <span class="font-bold text-blue-600">-라</span><br/>
              因为是…… (名词 + -(이)라)
            </li>
            <li>
              <span class="font-bold text-purple-600">-다 보니까</span><br/>
              因为一直……所以…… (表示做某事过程中发现了后面的结果)
            </li>
          </ul>
        `
      },
      {
        korean: `오해가 더 <span class="text-blue-600">많아지는</span> <span class="text-purple-600">거 같아</span>.`,
        chinese: `好像误会变得越来越<span class="text-blue-600 font-bold">多</span><span class="text-purple-600 font-bold">了</span>。`,
        words: ["오해", "-아/어지다", "-는 거 같다"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold">오해</span>: 误会
            </li>
            <li>
              <span class="font-bold text-blue-600">-아/어지다</span><br/>
              表示状态变化，“变得……”
            </li>
            <li>
              <span class="font-bold text-purple-600">-는 거 같아</span><br/>
              表示主观推测，“好像……”
            </li>
          </ul>
        `
      },
      {
        korean: `그것 때문에 <span class="text-blue-600">서운해서</span> 엄마 혼자 <span class="text-purple-600">그러지 않았을까</span>.`,
        chinese: `所以妈妈可能因为<span class="text-blue-600 font-bold">难过</span>一个人<span class="text-purple-600 font-bold">那样了吧</span>。`,
        words: ["때문에", "서운하다", "그러다", "-지 않았을까"],
        note: `
          <ul class="list-disc pl-5 space-y-3">
            <li>
              <span class="font-bold">그것 때문에</span>: 因为那个
            </li>
            <li>
              <span class="font-bold text-blue-600">서운하다</span>: 难过、失落
            </li>
            <li>
              <span class="font-bold text-purple-600">그러다</span><br/>
              意思是“那样做/那么说” (动词)，TOPIK中级词汇，只在口语中使用。<br/>
              注意这里的<span class="text-purple-500">그러지</span>原形不是그렇다，如果是그렇다，那应该是그렇지而不是그러지。
            </li>
            <li>
              <span class="font-bold text-purple-600">-지 않았을까</span><br/>
              表示推测，“是不是……了呢？”
            </li>
          </ul>
        `
      },
    ],
  },
];





