# 第 2 集《不用试遍所有数》逐句台词 → nt2_lines.json
# 每行 tuple：(text, voice None|'kid'|'qm', hold_before, say, hide, iu)
#   前 5 项和 lines_nt1.py 相同，原样交给 timing.lay；
#   第 6 项 iu 是这一行新增的"信息单元"类型（D 定义/命名，R 推理步骤，E 例子/数据，C 断言，P 视角转换，H 史实/引用），
#   只用于密度统计，写进 json 的 sub 里（字段 "iu"），场景代码不用管它。
# 配音：旁白云希（语速见 VOICES，第 1 集 +5%），孩子云夏、小问号不变。
# 片长按真实配音排：先生成配音（python3 pregen.py nt2_lines.json，声音设置取自本文件的 VOICES 和 ALT_VOICES），
#   再跑本脚本。有配音的行按 max(公式估算, 配音长度 + 0.3) 排，和 tools/audio.py 成片时的做法一致；没有配音的行只按公式估算。
# 运行：python3 script-src/lines_nt2.py（先跑 verify() 核对全部算式，再排时间、打印密度，写 nt2_lines.json），
#   然后 python3 script-src/gen_sb2.py 生成 ../ep2-storyboard.md。键名以 x_ 开头的是可删延伸，不在主时间线里。
from timing import lay, units, vis
import timing, json, hashlib, os, re

ROOT = '/home/user/html-markdown/number-theory'
VOICES = {  # 第 2 集的配音设置（src/ep2/meta.json 建好后以它为准）
    'narr': {'voice': 'zh-CN-YunxiNeural', 'rate': '+15%', 'pitch': '+0Hz'},
    'kid': {'voice': 'zh-CN-YunxiaNeural', 'rate': '+0%', 'pitch': '+0Hz'},
    'qm': {'voice': 'zh-CN-YunxiNeural', 'rate': '+8%', 'pitch': '+30Hz'},
}
_meta = f'{ROOT}/src/ep2/meta.json'
if os.path.exists(_meta):
    VOICES = json.load(open(_meta, encoding='utf-8'))['audio']['voices']
# 公式估算的提速系数：2026-10-08 用 24 句第 1 集旁白实测（云希重新生成 +5% / +15% / +20%，时长之比 1.000 / 0.915 / 0.880）
RATE_SPEED = {'+5%': 1.0, '+15%': 0.915, '+20%': 0.88}
def speed_of(voices): return {v: RATE_SPEED.get(c['rate'], 1.0) if v == 'narr' else 1.0 for v, c in voices.items()}
SPEED = speed_of(VOICES)
# 只用来打印对照：旁白换成另一档语速（+15% ↔ +20%），其余不变
ALT_VOICES = {**VOICES, 'narr': {**VOICES['narr'], 'rate': '+20%' if VOICES['narr']['rate'] != '+20%' else '+15%'}}
# 密度下限（定稿时的数，改稿时用来检查没有变稀；理由见 ep2-storyboard.md 头部"时长与密度"）：
#   第 1 集口径（say 全部字符，含标点）、漫士口径（汉字 + 字母数字串，不含标点），都按真实配音排出的片长算
TARGET = (215, 175)


def clip(voices, voice, say):
    vc = voices[voice]; h = hashlib.sha1(json.dumps([vc, say], ensure_ascii=False).encode()).hexdigest()[:16]
    return f'{ROOT}/audio/voice/{h}.mp3'


def real_for(voices):
    def real(voice, say):
        f = clip(voices, voice, say)
        if not os.path.exists(f): return None
        from mutagen.mp3 import MP3
        return MP3(f).info.length
    return real
real = real_for(VOICES)


def lay_v(lines, voices=VOICES, **kw):
    """timing.lay，但按声音分别提速：只在这次调用里把 PACE 按语速缩放，调用完恢复（timing.py 的默认行为不变）。"""
    keep = dict(timing.PACE); speed = speed_of(voices)
    try:
        for v, (a, b) in keep.items():
            timing.PACE[v] = (a * speed[v], b * speed[v])
        return lay(lines, real=real_for(voices), **kw)
    finally:
        timing.PACE.clear(); timing.PACE.update(keep)


K = 'kid'; Q = 'qm'
S = {
'title': [('一道题长大了，第二集：不用试遍所有数', None, 0, '一道题长大了。第二集：不用试遍所有数。', True, '')],
'lanes': [
    ('“上集的空格：还没找到，还是根本没有？”', Q, 0, '上集的空格：还没找到，还是根本没有？', None, 'P'),
    ('说好分平方：9是3×3，两组4个剩1个。', None, 0.4, '说好分平方：九是三乘三，两组四个，剩一个。', None, 'E'),
    ('剩下的零头，就是你做除法时的余数；', None, 0.15, None, None, 'D'),
    ('剩够4个还能再凑一组，所以只能是0到3。', None, 0.1, '剩够四个还能再凑一组，所以只能是零到三。', None, 'RC'),
    ('不光平方：把每个数轮着排进四条跑道，', None, 0.3, None, None, 'D'),
    ('每满一轮多一组4个，所以排哪条就余几。', None, 0.1, '每满一轮，多一组四个，所以排哪条，就余几。', None, 'RC'),
    ('每个数只轮到一次，所以只在一条跑道上。', None, 0.2, None, None, 'RC'),
    ('地图上看“剩几个”的门，就叫余数门。', None, 0.3, None, None, 'D'),
],
'why4': [
    ('“为什么偏偏四个四个分？”', Q, 0.3, '为什么偏偏四个四个分？', None, 'P'),
    ('上集的空格2、6、10、14，隔4一个：', None, 0.15, '上集的空格：二、六、十、十四，隔四一个：', None, 'E'),
    ('2余2；多一整组零头不变，所以全余2。', None, 0.1, '二余二；多一整组，零头不变，所以全余二。', None, 'RC'),
    ('“两个两个分，不是更简单？”', K, 0.3, '两个两个分，不是更简单？', None, 'P'),
    ('两个两个分：4有写法，6还没找到，', None, 0.1, '两个两个分：四有写法，六还没找到，', None, 'E'),
    ('却挤在同一个偶数堆里，分不开。', None, 0.1, None, None, 'R'),
    ('按4分：4、8、12去余0，空格去余2。', None, 0.15, '按四分：四、八、十二去余零，空格去余二。', None, 'EC'),
],
'agenda': [
    ('一组4个能两两配对，奇偶只看零头：', None, 0.3, '一组四个能两两配对，奇偶只看零头：', None, 'R'),
    ('余1、余3是奇数：上集证过全有小拐角。', None, 0.1, '余一、余三是奇数：上集证过，全有小拐角。', None, 'RC'),
    ('今年是2026年：506余2，也在余2。', None, 0.3, '今年是两千零二十六年：五百零六余二，也在余二。', None, 'E'),
    ('漫士演讲时讲过拿糖游戏，秘诀：四颗一组。', None, 0.4, None, None, 'H'),
    ('他还说数学能说“这个世界上谁都做不到”。', None, 0.2, '他还说，数学能说：这个世界上谁都做不到。', None, 'H'),
    ('“平方落哪几条？两个平方相减呢？”', Q, 0.3, '平方落哪几条？两个平方相减呢？', None, 'PP'),
],
'squares': [
    ('“上集平方只剩0和1，大的总会剩2、3吧？”', K, 0.4, '上集平方只剩零和一，大的总会剩二、三吧？', None, 'C'),
    ('0、4、16、36、64、100：余0；', None, 0.3, '零、四、十六、三十六、六十四、一百：余零；', None, 'E'),
    ('1、9、25、49、81：余1。', None, 0.1, '一、九、二十五、四十九、八十一：余一。', None, 'E'),
    ('这11个里，余2、余3一个都没有。', None, 0.1, '这十一个里，余二、余三，一个都没有。', None, 'C'),
    ('“看着像：偶数的平方余0，奇数的余1？”', K, 0.3, '看着像：偶数的平方余零，奇数的余一？', None, 'C'),
    ('“第一百个平方，也这样吗？”', Q, 0.3, '第一百个平方，也这样吗？', None, 'P'),
],
'even': [
    ('边长不是偶数就是奇数：切两种正方形就够。', None, 0.4, None, None, 'R'),
    ('随便多大的偶数边：m加m，m是几都行，', None, 0.2, '随便多大的偶数边：m 加 m，m 是几都行，', None, 'D'),
    ('横竖各一刀，切成4块m×m，一样多。', None, 0.1, '横竖各一刀，切成四块 m 乘 m，一样多。', None, 'R'),
    ('每块各拿1个凑一组，4块同时拿空：余0。', None, 0.15, '每块各拿一个凑一组，四块同时拿空：余零。', None, 'RC'),
],
'odd': [
    ('“奇数边也从中间切！咦，多出一排一列？”', K, 0.3, '奇数边也从中间切！咦，多出一排一列？', None, 'E'),
    ('换个切法：奇数边是m加1加m，', None, 0.2, '换个切法：奇数边是 m 加一加 m，', None, 'D'),
    ('中间留1个点，四周切4片风车，', None, 0.1, '中间留一个点，四周切四片风车，', None, 'R'),
    ('每片一边m、一边m+1。', None, 0.1, '每片一边 m，一边 m 加一。', None, 'R'),
    ('外圈：长边m+1接短边m，正好一条边；', None, 0.25, '外圈：长边 m 加一，接短边 m，正好一条边；', None, 'R'),
    ('里圈：长边m+1，对着短边m加中心1个。', None, 0.1, '里圈：长边 m 加一，对着短边 m，加中心一个。', None, 'R'),
    ('4片一样多，照样拿空，中间剩1个：余1。', None, 0.15, '四片一样多，照样拿空，中间剩一个：余一。', None, 'RC'),
    ('切法不看m：每个平方除以4，只余0或1。', None, 0.2, '切法不看 m：每个平方除以四，只余零或一。', None, 'RC'),
    ('“大的也只余0或1：剩2、3的猜想错了！”', K, 0.3, '大的也只余零或一：剩二、三的猜想错了！', None, 'C'),
],
'predict': [
    ('风车还能先报商：37是18加1加18，', None, 0.4, '风车还能先报商：三十七是十八加一加十八，', None, 'PR'),
    ('所以37的平方是4片18×19，再加1；', None, 0.1, '所以三十七的平方，是四片十八乘十九，再加一；', None, 'R'),
    ('18×19是342：应该商342，余1。', None, 0.1, '十八乘十九是三百四十二：应该商三百四十二，余一。', None, 'R'),
    ('“37×37是1369，除以4……”', K, 0.2, '三十七乘三十七是一千三百六十九，除以四……', None, ''),
    ('“342余1！连商都对上了！”', K, 0.1, '三百四十二余一！连商都对上了！', None, 'E'),
    ('2026减1369？先别算：零头2和1。', None, 0.4, '两千零二十六减一千三百六十九？先别算：零头二和一。', None, 'E'),
    ('零头够减，整组减整组还是整组：只看零头。', None, 0.1, None, None, 'R'),
    ('“2减1，预测余1！算出657……真余1！”', K, 0.2, '二减一，预测余一！算出六百五十七……真余一！', None, 'RE'),
    ('“以后算完减法，我也用零头查一遍！”', K, 0.1, '以后算完减法，我也用零头查一遍！', None, 'C'),
],
'proof': [
    ('轮到6了。换个走法：先假设它写得出。', None, 0.4, '轮到六了。换个走法：先假设它写得出。', None, 'R'),
    ('规则卡上两个数叫a、b：a²−b²=6。', None, 0.1, '规则卡上两个数叫 a、b：a 平方减 b 平方，等于六。', None, 'D'),
    ('记账：两个平方都四个一组，各剩零头；', None, 0.3, None, None, 'D'),
    ('刚证过：两个零头都只能是0或1。', None, 0.1, '刚证过：两个零头都只能是零或一。', None, 'R'),
    ('“零头只有0和1，相减也只剩0和1！”', K, 0.3, '零头只有零和一，相减也只剩零和一！', None, 'C'),
    ('“上集的7呢？16减9。”', Q, 0.2, '上集的七呢？十六减九。', None, 'E'),
    ('“7……四个一组，剩3！哪来的3？”', K, 0.2, '七……四个一组，剩三！哪来的三？', None, 'E'),
],
'borrow': [
    ('16余0，9余1：零头0减1，不够减。', None, 0.2, '十六余零，九余一：零头零减一，不够减。', None, 'R'),
    ('“不够减？借呀，跟竖式借位一样！”', K, 0.2, '不够减？借呀，跟竖式借位一样！', None, 'P'),
    ('这里拆开一组：4个加0个，减1，剩3。', None, 0.1, '这里拆开一组：四个加零个，减一，剩三。', None, 'R'),
    ('只看零头：0减0、1减1，得0；', None, 0.3, '只看零头：零减零、一减一，得零；', None, 'RR'),
    ('1减0得1；0减1借一组得3：就这四种。', None, 0.1, '一减零得一；零减一借一组，得三：就这四种。', None, 'RC'),
    ('“要是没有整组可借呢？”', Q, 0.3, '要是没有整组可借呢？', None, 'P'),
    ('a比b大，a×a罩得住b×b：a²更大，', None, 0.15, 'a 比 b 大，a 乘 a 罩得住 b 乘 b：a 的平方更大，', None, 'R'),
    ('排得更靠后，转过的整轮只多不少：组够减。', None, 0.1, None, None, 'R'),
    ('要借时，a²余0、b²余1：', None, 0.2, '要借时，a 的平方余零，b 的平方余一：', None, 'R'),
    ('“同一轮里余0在前，a²只能在后一轮！”', K, 0.2, '同一轮里余零在前，a 的平方只能在后一轮！', None, 'R'),
    ('多一轮，就多一组可借。', None, 0.1, None, None, 'R'),
],
'wall': [
    ('所以两个平方相减，零头只能是0、1、3：', None, 0.3, '所以两个平方相减，零头只能是零、一、三：', None, 'C'),   # 不说"两个平方的差"：云希把这里的"差"读成 chà（音高测过）
    ('不借时，结果不超过大平方的零头：0或1；', None, 0.1, '不借时，结果不超过大平方的零头：零或一；', None, 'R'),
    ('借一组，总是3。余2那条，谁也到不了。', None, 0.1, '借一组，总是三。余二那条，谁也到不了。', None, 'RC'),
    ('可6在余2那条；一个数只在一条跑道上，', None, 0.3, '可六在余二那条；一个数只在一条跑道上，', None, 'R'),
    ('不可能又在0、1、3：撞墙了。', None, 0.1, '不可能又在零、一、三：撞墙了。', None, 'R'),
    ('所以假设错了：6根本没有小拐角。', None, 0.15, '所以假设错了：六根本没有小拐角。', None, 'C'),
    ('先假设能做到，推到撞墙：这叫反证法。', None, 0.4, None, None, 'D'),
],
'dark': [
    ('“只有6不行吗？”', Q, 0.5, '只有六不行吗？', None, 'P'),
    ('用到了6的什么？只用到“6余2”。', None, 0.15, '用到了六的什么？只用到“六余二”。', None, 'R'),
    ('所以换成任何余2的数都一样：整条熄灭。', None, 0.1, '所以换成任何余二的数，都一样：整条熄灭。', None, 'C'),
    ('上集电脑查到1000，还查不完；', None, 7.0, '上集电脑查到一千，还查不完；', None, ''),
    ('这回一个理由，管住了这条跑道上的每一个。', None, 0.1, None, None, 'C'),
    ('“2026余2，不用试：没有小拐角！”', K, 0.3, '两千零二十六余二，不用试：没有小拐角！', None, 'E'),
    ('你看过的另一场演讲里，漫士讲了翻杯子、', None, 0.5, None, None, ''),
    ('变色龙这类游戏：去找怎么变都不变的东西。', None, 0.1, None, None, 'H'),
    ('我们找到的，是零头：整组进出，它不变。', None, 0.25, None, None, 'P'),
],
'enough': [
    ('“过了余数门，就一定行吗？”', Q, 0.5, '过了余数门，就一定行吗？', None, 'P'),
    ('换个问题：2021是平方吗？余1，过关。', None, 0.2, '换个问题：两千零二十一是平方吗？余一，过关。', None, 'E'),
    ('“44²是1936，45²是2025！”', K, 0.2, '四十四平方，一千九百三十六！四十五平方，两千零二十五！', None, 'E'),
    ('44、45挨着，边长越大平方越大：', None, 0.1, '四十四、四十五挨着，边长越大，平方越大：', None, 'R'),
    ('夹在中间的2021，不是平方。', None, 0.1, '夹在中间的两千零二十一，不是平方。', None, 'C'),
    ('2025是平方，也余1：光看余数分不开。', None, 0.2, '两千零二十五是平方，也余一：光看余数，分不开。', None, 'R'),
    ('“可2021是45²减2²，有小拐角！”', K, 0.3, '可两千零二十一，是四十五平方减二平方，有小拐角！', None, 'E'),
    ('对：平方差和平方，是两件事。', None, 0.15, None, None, 'D'),
    ('余数门能判“一定不是”，判不了“是”。', None, 0.3, None, None, 'C'),
    ('回到余0那条：4、8、12、16有写法，', None, 0.4, '回到余零那条：四、八、十二、十六有写法，', None, 'E'),
    ('“20、24……肯定也行！”', K, 0.1, '二十、二十四……肯定也行！', None, 'C'),
    ('“又是猜想？”', Q, 0.15, '又是猜想？', None, ''),
    ('对，还是猜想：余数门答不了这一条。', None, 0.15, None, None, 'C'),
],
'ending': [
    ('这级台阶“为什么不可能”，为余2亮了。', None, 0.4, '这级台阶“为什么不可能”，为余二亮了。', None, 'C'),
    ('要是非把除法除尽，就得请来新的数。', None, 0.4, None, None, 'C'),
    ('“余数门一个理由，就关掉一整条！”', K, 0.4, '余数门一个理由，就关掉一整条！', None, 'C'),
    ('余0的行不行、怎么找全，靠看谁乘谁的门：', None, 0.3, '余零的行不行、怎么找全，靠看谁乘谁的门：', None, ''),
    ('因子门。下一集，就打开它。', None, 0.1, None, None, 'P'),
],
'end': [
    ('下集：两扇门，同一个房间。', None, 0.3, None, None, ''),
    ('《一道题长大了》，第二集完。', None, 0.6, None, None, ''),
],
}

# 可删延伸（不在主时间线里，json 里键名以 x_ 开头，带 optional/after）：有余量时插在 dark 之后、enough 之前
X = {
'x_three': [
    ('“按3分呢？也能空出一条吗？”', Q, 0.4, '按三分呢？也能空出一条吗？', None, 'P'),
    ('三个三个分，只有三条跑道：', None, 0.2, None, None, 'D'),
    ('3=2²−1²余0，4=2²−0²余1，', None, 0.15, '三是二的平方减一的平方，余零；四是二的平方减零的平方，余一；', None, 'EE'),
    ('5=3²−2²余2：三条全有，', None, 0.1, '五是三的平方减二的平方，余二：三条全有，', None, 'EC'),
    ('一个也排除不了。选几来分组，有讲究。', None, 0.15, None, None, 'C'),
],
}


def verify():
    """片中每个算式和每条结论都在这里用程序核对；改台词里的数字时先改这里。"""
    n = 0
    def ok(c, msg=''):
        nonlocal n; assert c, msg; n += 1
    sq = lambda x: x * x
    def is_diff(N):  # N 能否写成 a² − b²（a > b ≥ 0；a 不超过 N 就够了）
        return any(sq(a) - sq(b) == N for a in range(N + 1) for b in range(a))
    ok(9 == sq(3) == 4 + 4 + 1 and 9 % 4 == 1)                                   # lanes：9 是 3×3，两组 4 个剩 1
    ok([x % 4 for x in (2, 6, 10, 14)] == [2] * 4 and [x % 4 for x in (4, 8, 12)] == [0] * 3)
    ok(2026 == 4 * 506 + 2)                                                      # 今年 2026
    ok([N for N in range(1, 17) if not is_diff(N)] == [2, 6, 10, 14])           # 上集的表
    ok(is_diff(4) and not is_diff(6) and 4 % 2 == 6 % 2 == 0)                   # 按 2 分：4、6 同堆
    for N in range(1, 4000, 2):                                                  # 奇数跑道整条都行（第 1 集的造法）
        ok(sq((N + 1) // 2) - sq((N - 1) // 2) == N and N % 4 in (1, 3))
    ok([sq(k) for k in range(11) if sq(k) % 4 == 0] == [0, 4, 16, 36, 64, 100])  # squares
    ok([sq(k) for k in range(11) if sq(k) % 4 == 1] == [1, 9, 25, 49, 81])
    ok(all(sq(k) % 4 in (0, 1) for k in range(11)) and len(range(11)) == 11)
    ok([sq(k) % 4 for k in range(1, 6)] == [1, 0, 1, 0, 1])                      # 上集片尾的 1、4、9、16、25
    ok(sq(6) == 36 == 4 * sq(3))                                                 # even: 边长 6，4 块 3×3
    for m in range(0, 2000):                                                     # 切法的代数（每个 m）
        ok(sq(m + m) == 4 * m * m and sq(m + 1 + m) == 4 * m * (m + 1) + 1)
    for m in range(0, 40):                                                       # 风车切法逐格铺满、不重叠；外圈、里圈逐边核对
        N = m + 1 + m; c = m; cells = {}
        P = ((0, 0, m, m + 1), (0, m + 1, m + 1, m), (m + 1, m, m, m + 1), (m, 0, m + 1, m))   # (行0, 列0, 高, 宽)
        for i, (r0, c0, h, w) in enumerate(P):
            for r in range(r0, r0 + h):
                for cc in range(c0, c0 + w):
                    ok((r, cc) not in cells); cells[(r, cc)] = i
        ok(len(cells) == N * N - 1 and (c, c) not in cells)
        if m == 0: continue
        sides = ([(0, j) for j in range(N)], [(i, N - 1) for i in range(N)], [(N - 1, j) for j in range(N)], [(i, 0) for i in range(N)])
        for s in sides:                                                          # 外圈每条边 = 一片的长边 m+1 + 另一片的短边 m
            owners = [cells[p] for p in s]
            runs = [owners.count(x) for x in dict.fromkeys(owners)]
            ok(sorted(runs) == [m, m + 1])
        for i in range(4):                                                       # 里圈：每片的长边 m+1 挨着另一片的短边 m 加中心 1 个
            r0, c0, h, w = P[i]
            if w == m + 1:   # 横放的片：长边是挨着中心那一侧的一行
                rr = r0 + h if r0 == 0 else r0 - 1
                nb = [cells.get((rr, j), 'C') for j in range(c0, c0 + w)]
            else:            # 竖放的片
                cc = c0 - 1 if c0 > 0 else c0 + w
                nb = [cells.get((r, cc), 'C') for r in range(r0, r0 + h)]
            ok(nb.count('C') == 1 and len(set(x for x in nb if x != 'C')) == 1 and len(nb) - 1 == m)
    ok(4 * 12 + 1 == 49 and 3 * 4 == 12 and 7 == 3 + 1 + 3 == 4 + 3)             # odd: 边长 7，外圈一条边 = 长边 4 + 短边 3
    ok(len(range(0, 16)) == 4 * 4 and [x % 4 for x in range(16)].count(0) == 4)  # lanes：砖 0–15 正好 4 轮
    ok(506 > 342)                                                                # predict：组栏 506 > 342
    ok(37 == 18 + 1 + 18 and 18 * 19 == 342 and sq(37) == 1369 == 4 * 342 + 1)  # predict
    ok(sq(46) == 2116 == 4 * 529 and 529 == 23 * 23)                             # （家长版备注里用）
    ok(2026 - 1369 == 657 == 4 * 164 + 1 and 4 * 164 == 656 and (2 - 1) == 657 % 4 and 1369 % 4 == 1 and 2026 // 4 == 506 >= 342 == 1369 // 4)
    ok(16 % 4 == 0 and 9 % 4 == 1 and (16 - 9) == 7 and 7 % 4 == 3 and 4 + 0 - 1 == 3)   # proof / borrow
    ok(16 == 4 * 4 + 0 and 9 == 4 * 2 + 1)
    ok(20 - 1 == 19 and 10 - 1 == 9)                                             # borrow 角上小卡：20 − 1，个位借一个十
    for (A, B, r, w, d) in ((16, 4, 0, 0, 0), (9, 1, 1, 1, 0), (9, 4, 1, 0, 1), (16, 9, 0, 1, 3)):   # 12、8、5、7 各占一格
        ok(A % 4 == r and B % 4 == w and (A - B) % 4 == d)
    ok([16 - 4, 9 - 1, 9 - 4, 16 - 9] == [12, 8, 5, 7])
    for a in range(1, 1100):                                                     # 记账：组够减、需要借时一定借得到、差不余 2
        for b in range(a):
            u, r = divmod(sq(a), 4); v, w = divmod(sq(b), 4)
            ok(r in (0, 1) and w in (0, 1) and u >= v and (r >= w or u >= v + 1) and (sq(a) - sq(b)) % 4 != 2)
            if r >= w: ok((sq(a) - sq(b)) % 4 == r - w <= r)                    # 不借：差的零头不超过大平方的零头
            else: ok((r, w) == (0, 1) and (sq(a) - sq(b)) % 4 == 3)              # 借：只有 0 − 1 这一格，得 3
    for x in range(0, 3000):                                                     # 跑道：数越大，转过的整轮只多不少；同一轮里余 0 在余 1 前面
        ok((x + 1) // 4 >= x // 4 and (4 * (x // 4)) < 4 * (x // 4) + 1)
    ok(6 == 4 + 2)
    ok(len(range(2, 999, 4)) == 250 and len(range(2, 2027, 4)) == 507)          # 熄灭计数器
    ok(not is_diff(2) and not is_diff(10) and not is_diff(14) and 2026 % 4 == 2)
    ok(2021 == 4 * 505 + 1 and sq(44) == 1936 and sq(45) == 2025 and 1936 < 2021 < 2025 and 45 - 44 == 1)   # enough
    ok(2025 % 4 == 1 and 2021 == sq(45) - sq(2) and 2025 - 4 == 2021)            # 2025 也余 1；2021 是平方差
    ok(all(sq(k + 1) > sq(k) for k in range(100)))                               # 边长越大平方越大
    ok(sq(2) - sq(0) == 4 and sq(3) - sq(1) == 8 and sq(4) - sq(2) == 12 and sq(5) - sq(3) == 16)
    ok(sq(6) - sq(4) == 20 and sq(5) - sq(1) == 24)                              # Jasper 猜得对（第 3 集证），片中不揭晓
    ok(all(is_diff(N) for N in range(4, 400, 4)))                                # （家长备注）余 0 跑道上的正整数其实全行
    ok(sq(2) - sq(1) == 3 and 3 % 3 == 0 and sq(2) - sq(0) == 4 and 4 % 3 == 1 and sq(3) - sq(2) == 5 and 5 % 3 == 2)  # x_three
    return n


HAN = re.compile(r'[一-鿿]'); RUN = re.compile(r'[A-Za-z0-9]+')
CONN = re.compile(r'所以|因为|如果|要是|只要|可是|不过|但是|却|于是|可(?![以能])')
def zh_count(s): return len(HAN.findall(s)) + len(RUN.findall(s))   # 漫士测量的口径：汉字 1、字母/数字串 1、标点不算


def stats(scenes, label):
    """scenes: {key: {'subs': [...], 'dur': d}}（json 的格式）。返回一组和第 1 集、漫士可比的数。"""
    dur = sum(v['dur'] for v in scenes.values())
    subs = [s for v in scenes.values() for s in v['subs']]
    say = [s.get('say', s['text']) for s in subs]
    talk = sum(s['t1'] - s['t0'] - 0.25 for s in subs)            # 估计的配音时长（字幕时长减去 margin）
    c1 = sum(len(x) for x in say); cz = sum(zh_count(x) for x in say)
    iu = ''.join(s.get('iu', '') for s in subs)
    kq = sum(len(x) for s, x in zip(subs, say) if s.get('voice'))
    conn = sum(len(CONN.findall(s['text'])) for s in subs)
    return dict(label=label, dur=dur, lines=len(subs), c1=c1, cpm1=c1 / dur * 60, cz=cz, cpmz=cz / dur * 60,
                talk=talk, cpm_talk=cz / talk * 60, iu=len(iu), iupm=len(iu) / dur * 60 if iu else None,
                rd=(iu.count('R') + iu.count('D')) / len(iu) if iu else None, types={t: iu.count(t) for t in 'RCEDPH'},
                conn=conn, connpm=conn / dur * 60, kq=kq / c1, avg=sum(len(s['text'].strip('“”')) for s in subs) / len(subs))


def clip_stats(voices=VOICES):
    """真实配音：有几行已生成、缺几行；旁白纯语速（漫士口径字数 ÷ 配音文件总长，文件自带首尾静音也算在内）。"""
    have = miss = 0; narr_z = narr_t = 0.0
    for k, lines in list(S.items()) + list(X.items()):
        for L in lines:
            v = L[1] or 'narr'; say = L[3] or L[0]; d = real_for(voices)(v, say)
            if d is None: miss += 1; continue
            have += 1
            if v == 'narr': narr_z += zh_count(say); narr_t += d
    return dict(have=have, miss=miss, narr_cpm=narr_z / narr_t * 60 if narr_t else None)


def speech_rate(voices=VOICES, thr=0.02):
    """旁白配音的真实语速：漫士口径字数 ÷ 从第一个发声到最后一个发声的时长（去掉配音文件首尾的静音）。
    返回 (字/分, 每条配音首尾静音的平均秒数, 用到的条数)；缺 numpy 或配音时返回 None。"""
    try:
        import numpy as np, subprocess, imageio_ffmpeg
    except ImportError:
        return None
    ff = imageio_ffmpeg.get_ffmpeg_exe(); z = act = tot = 0.0; n = 0
    for k, lines in S.items():
        for L in lines:
            if (L[1] or 'narr') != 'narr' or L[4]: continue
            f = clip(voices, 'narr', L[3] or L[0])
            if not os.path.exists(f): return None
            raw = subprocess.run([ff, '-v', 'quiet', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
            x = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32)) / 32768
            w = 160; e = x[: len(x) // w * w].reshape(-1, w).max(axis=1); idx = np.where(e > thr)[0]
            if not len(idx): continue
            act += (idx[-1] - idx[0] + 1) * w / 16000; tot += len(x) / 16000; z += zh_count(L[3] or L[0]); n += 1
    return z / act * 60, (tot - act) / n, n


def run(voices=VOICES, **kw):
    out = {}
    for k, lines in list(S.items()) + list(X.items()):
        subs, dur = lay_v([L[:5] for L in lines], voices=voices, **kw)
        for s, L in zip(subs, lines):
            if L[5]: s['iu'] = L[5]
        out[k] = {'subs': subs, 'dur': dur}
        if k.startswith('x_'): out[k].update(optional=True, after='dark')
    return out


def total(out): return sum(v['dur'] for k, v in out.items() if not k.startswith('x_'))
def trim_run(voices=VOICES): return run(voices, margin=0.1, gap=0.05, real_pad=0.1)   # 按配音实际结束点计时的对照


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print('verify:', verify(), 'checks OK')
    cs = clip_stats()
    print(f"真实配音：{cs['have']} 行已有，{cs['miss']} 行缺（缺的只按公式估算；先跑 python3 pregen.py nt2_lines.json）"
          + (f"；旁白纯语速约 {cs['narr_cpm']:.0f} 字/分（漫士口径，含配音文件首尾静音）" if cs['narr_cpm'] else ''))
    out = run()
    main = {k: v for k, v in out.items() if not k.startswith('x_')}
    for k, v in out.items():
        chars = sum(len(s.get('say', s['text'])) for s in v['subs'])
        print(f"{k:8} {v['dur']:6.1f}s  {len(v['subs']):2d} lines  {chars} chars" + ('   (可删延伸，不计入总长)' if k.startswith('x_') else ''))
    e2 = stats(main, '第 2 集')
    e1 = stats(json.load(open('nt1_lines.json', encoding='utf-8')), '第 1 集')
    talt = total(run(ALT_VOICES))
    print(f"TOTAL {e2['dur']:.1f} s = {int(e2['dur'] // 60)}:{e2['dur'] % 60:04.1f}（旁白 {VOICES['narr']['rate']}；"
          f"若用 {ALT_VOICES['narr']['rate']}：{talt:.1f} s）  {e2['lines']} 行")
    for e in (e1, e2):
        print(f"{e['label']}: 解说 {e['cpm1']:.0f} 字/分（第 1 集口径：say 全部字符含标点）｜漫士口径 {e['cpmz']:.0f} 字/分，"
              f"只算配音 {e['cpm_talk']:.0f}｜每行 {e['avg']:.1f} 字｜连接词 {e['connpm']:.2f}/分｜孩子+小问号 {e['kq']:.0%}")
    print(f"第 2 集信息单元 {e2['iu']} 个，{e2['iupm']:.1f}/分，R+D {e2['rd']:.0%}，{e2['types']}")
    et = stats({k: v for k, v in trim_run().items() if not k.startswith('x_')}, 'trim')
    print(f"信息单元保守口径（一行最多算 1 个）：{sum(1 for v in main.values() for s in v['subs'] if s.get('iu'))} 个")
    print(f"密度下限：第 1 集口径 ≥ {TARGET[0]} 字/分 {'✓' if e2['cpm1'] >= TARGET[0] else '✗'}；漫士口径 ≥ {TARGET[1]} {'✓' if e2['cpmz'] >= TARGET[1] else '✗'}"
          f"（第 1 集 {e1['cpm1']:.0f} / {e1['cpmz']:.0f}；漫士整片 268、只算说话 313）")
    print(f"对照：制作时若按语音实际结束点计时（margin 0.1、gap 0.05、配音 + 0.1），同一稿 {et['dur']:.0f} s，{et['cpm1']:.0f} / {et['cpmz']:.0f} 字/分")
    sr = speech_rate()
    if sr: print(f"旁白真实语速（去掉配音首尾静音）约 {sr[0]:.0f} 字/分；每条配音首尾静音平均 {sr[1]:.2f} 秒（{sr[2]} 条）")
    long = [(k, s['text']) for k, v in out.items() for s in v['subs'] if not s.get('hide') and vis(s['text']) > 20]
    assert not long, long
    json.dump(out, open('nt2_lines.json', 'w'), ensure_ascii=False, indent=1)
