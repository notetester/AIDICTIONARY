(() => {
  const extraDetails = {
    "low-rank-factorization": {
      intuition: "거대한 표 전체를 새로 외우는 대신, 몇 개의 핵심 축을 조합해 변화 전체를 표현하는 방법이다.",
      precise: "행렬 M을 더 작은 내부 차원 r을 갖는 두 행렬 B와 A의 곱 BA로 근사하거나 매개변수화하는 기법이다. r이 입력·출력 차원보다 작으면 저장량과 계산량을 줄이는 동시에 표현 가능한 변화의 rank를 제한한다.",
      mechanism: [
        "큰 행렬의 행·열 차원을 확인한다.",
        "내부 차원 r을 선택한다.",
        "B와 A를 학습하거나 SVD 등으로 계산한다.",
        "BA가 원래 행렬 또는 필요한 업데이트를 얼마나 잘 표현하는지 평가한다."
      ],
      why: "LoRA가 효율적인 이유를 정확히 이해하려면 '작은 행렬 두 개'라는 설명을 넘어 rank 상한, 파라미터 수, 근사 오차를 알아야 한다.",
      misconceptions: [
        ["저랭크는 값의 정밀도를 낮추는 양자화다.", "저랭크는 행렬이 사용하는 독립 방향의 수를 줄이는 것이고, 양자화는 각 숫자의 표현 비트를 줄이는 것이다."],
        ["r이 작으면 원본 가중치도 저랭크가 된다.", "LoRA에서는 원본 W는 그대로 두고 업데이트 ΔW만 저랭크로 제한한다."]
      ],
      practice: [
        "r별 trainable parameter를 계산한다.",
        "학습 후 ΔW의 특이값 분포를 확인한다.",
        "rank 증가가 평가 품질과 비용에 실제로 기여하는지 검증한다."
      ],
      prerequisites: ["parameter"],
      next: ["lora", "lora-rank", "singular-value-decomposition", "effective-rank"],
      formula: [["저랭크 표현", "ΔW = BA", "B∈R^(d_out×r), A∈R^(r×d_in)이며 rank(BA)≤r이다."]]
    },
    "lora-scaling-factor": {
      intuition: "LoRA가 만든 변화량을 원본 모델에 섞을 때 사용하는 실제 볼륨 조절값이다.",
      precise: "LoRA branch의 출력 또는 ΔW에 곱하는 계수 s다. 전형적 LoRA는 s=alpha/r을 사용하지만 rsLoRA처럼 s=alpha/√r을 쓰는 변형도 있으므로 설정 이름만으로 실제 scaling을 단정하면 안 된다.",
      mechanism: [
        "A와 B가 저랭크 업데이트를 계산한다.",
        "rank와 alpha로 구현별 scaling을 계산한다.",
        "scaled update를 원본 선형 계층 출력에 더한다.",
        "병합 시 동일 scaling이 W에 반영된다."
      ],
      why: "rank를 바꾸면서 alpha를 고정하면 표현 용량뿐 아니라 업데이트의 유효 크기까지 바뀔 수 있어 실험 해석이 교란된다.",
      misconceptions: [
        ["alpha만 같으면 LoRA 강도도 같다.", "일반 scaling에서는 rank가 달라지면 alpha/r도 달라진다."],
        ["scaling을 같게 맞추면 rank 실험의 모든 조건이 같다.", "업데이트 배율은 같아도 표현 공간과 파라미터 수는 다르다."]
      ],
      practice: [
        "사용 라이브러리의 실제 scaling 식을 확인한다.",
        "rank 고정 alpha sweep과 scaling 고정 rank 비교를 구분한다.",
        "병합 전후 출력 오차로 scaling 적용을 검증한다."
      ],
      prerequisites: ["lora-rank", "lora-alpha"],
      next: ["rank-stabilized-lora", "grid-search", "ablation-study"],
      formula: [["일반 LoRA", "s = alpha / r", "라이브러리·변형에 따라 다른 식을 사용할 수 있다."]]
    },
    "rank-stabilized-lora": {
      intuition: "rank를 크게 했는데 변화 신호가 지나치게 작아지는 문제를 줄이려는 LoRA 변형이다.",
      precise: "일반 alpha/r 대신 alpha/√r scaling을 사용하는 대표적 안정화 방식이다. rank 증가 시 scaling이 더 완만하게 감소하도록 해 높은 rank의 표현 용량을 활용하기 쉽게 만든다.",
      mechanism: [
        "기본 LoRA와 동일하게 A·B를 학습한다.",
        "scaling 분모를 r이 아니라 √r로 계산한다.",
        "높은 rank에서도 상대적으로 큰 adapter 신호를 유지한다.",
        "동일 조건의 일반 LoRA와 품질·안정성을 비교한다."
      ],
      why: "rsLoRA를 켠 r32와 끈 r16을 비교하면 rank 효과와 scaling 방식 효과가 동시에 바뀐다.",
      misconceptions: [
        ["rsLoRA는 rank를 자동 선택한다.", "사용자가 rank를 정하며, scaling 규칙만 달라진다."],
        ["항상 일반 LoRA보다 좋다.", "데이터·학습률·rank 범위에 따라 이점이 달라 실험이 필요하다."]
      ],
      practice: ["설정 플래그와 라이브러리 버전을 기록한다.", "동일 rank·alpha에서 일반 LoRA와 비교한다.", "gradient norm과 validation metric을 함께 관찰한다."],
      prerequisites: ["lora-scaling-factor"],
      next: ["multi-seed-evaluation", "effective-rank"]
    },
    "adapter-merge": {
      intuition: "원본 모델과 별도 LoRA 부품을 하나의 완성된 모델 파일로 합치는 과정이다.",
      precise: "학습된 scaled low-rank update를 원본 선형 가중치에 수치적으로 더해 W_merged=W+sBA를 만드는 과정이다. 병합 dtype과 이후 양자화 순서에 따라 반올림 오차가 달라질 수 있다.",
      mechanism: ["base와 adapter의 정확한 호환성을 확인한다.", "adapter scaling을 적용해 ΔW를 계산한다.", "고정밀 base weight에 ΔW를 더한다.", "병합 모델을 저장하고 adapter wrapper를 제거한다.", "병합 전후 logits 또는 골든셋을 비교한다."],
      why: "배포는 단순해지지만 여러 adapter를 동적으로 교체하기 어렵고, 잘못된 base나 dtype으로 병합하면 복구하기 어려운 품질 손실이 생긴다.",
      misconceptions: [["merge는 파일을 단순히 이어 붙이는 작업이다.", "행렬 업데이트를 실제 원본 가중치에 더하는 수치 연산이다."], ["병합하면 출력이 반드시 완전히 동일하다.", "dtype 반올림과 후속 양자화로 미세한 차이가 생길 수 있다."]],
      practice: ["base commit과 adapter SHA를 매니페스트에 기록한다.", "병합 전후 동일 prompt의 logits 또는 출력 차이를 검사한다.", "병합 후 GGUF 변환과 양자화를 별도 단계로 검증한다."],
      prerequisites: ["lora", "lora-scaling-factor"],
      next: ["gguf", "quantization", "regression-test"],
      formula: [["병합", "W_merged = W + sBA", "s는 해당 adapter의 실제 scaling이다."]]
    },
    "attention-head": {
      intuition: "한 문장을 한 가지 관점으로만 보지 않고, 여러 작은 관찰자가 동시에 서로 다른 관계를 계산하게 하는 구조다.",
      precise: "multi-head attention에서 독립적인 Q/K/V subspace를 사용하는 한 계산 단위다. 각 head는 d_head 차원의 attention을 계산하며 결과는 concat 후 output projection으로 결합된다.",
      mechanism: ["hidden state를 head별 Q/K/V로 투영한다.", "각 head가 독립 attention score를 계산한다.", "head별 Value 가중합을 만든다.", "모든 head 결과를 연결하고 o_proj로 합친다."],
      why: "head 수, KV head 수, head dimension은 KV cache 크기와 모델 구조 이해에 중요하다.",
      misconceptions: [["각 head에는 사람이 이름 붙일 수 있는 고정 역할이 있다.", "일부 패턴은 관찰되지만 역할은 학습 중 분산되고 고정적이지 않다."], ["head가 많으면 항상 관계를 더 잘 본다.", "hidden size와 계산 예산 안에서 head dimension이 줄어드는 tradeoff가 있다."]],
      practice: ["config에서 num_attention_heads와 num_key_value_heads를 확인한다.", "GQA/MQA 구조를 구분한다.", "head pruning 해석은 성능 실험과 함께 수행한다."],
      prerequisites: ["attention"],
      next: ["head-dimension", "q-projection", "k-projection", "v-projection", "o-projection"]
    },
    "q-projection": {
      intuition: "현재 토큰이 문맥에서 무엇을 찾고 싶은지를 표현하는 질문 벡터를 만드는 계층이다.",
      precise: "hidden state X에 학습된 W_Q를 적용해 Query Q=XW_Q를 만드는 선형 투영이다. Q는 Key와의 내적을 통해 attention score를 만든다.",
      mechanism: ["입력 hidden vector를 받는다.", "W_Q 행렬곱으로 Query를 만든다.", "head 단위로 reshape한다.", "K와 scaled dot product를 계산한다."],
      why: "q_proj LoRA는 어떤 관계를 검색할지에 해당하는 표현을 바꿀 수 있어 attention-only 튜닝의 핵심 target이다.",
      misconceptions: [["Query는 사용자가 입력한 질문 문장이다.", "여기서 Query는 모든 토큰 위치마다 내부적으로 생성되는 수치 벡터다."], ["q_proj만 튜닝하면 attention 전체를 튜닝한 것이다.", "K/V/O는 고정되어 다른 부분의 표현 능력은 제한된다."]],
      practice: ["모델 구조에서 fused QKV인지 분리 projection인지 확인한다.", "q-only와 q+v 등 target 조합을 통제 비교한다."],
      prerequisites: ["attention", "attention-head"],
      next: ["k-projection", "v-projection", "target-modules"],
      formula: [["Query 투영", "Q = XW_Q", "X는 hidden state, W_Q는 Query projection weight다."]]
    },
    "gated-mlp": {
      intuition: "정보를 크게 확장한 뒤, 별도의 문이 어떤 특징을 통과시킬지 조절하고 다시 원래 크기로 줄이는 블록이다.",
      precise: "Transformer FFN의 변형으로 두 개의 입력 투영 중 하나를 gate로 사용한다. SwiGLU 계열은 down_proj(SiLU(gate_proj(x))⊙up_proj(x)) 형태를 흔히 사용한다.",
      mechanism: ["up_proj와 gate_proj가 입력을 intermediate dimension으로 확장한다.", "gate 경로에 비선형 activation을 적용한다.", "두 경로를 원소별 곱한다.", "down_proj로 hidden dimension에 복원한다.", "residual stream에 더한다."],
      why: "attention+MLP LoRA는 이 세 projection까지 바꾸므로 파라미터 수와 도메인 적응 범위가 크게 늘어난다.",
      misconceptions: [["MLP는 토큰끼리 정보를 교환한다.", "기본 MLP는 각 토큰 위치에 독립적으로 같은 함수를 적용하며 토큰 간 교환은 attention이 담당한다."], ["gate는 0 또는 1만 출력한다.", "연속적인 활성값으로 특징 통과량을 조절한다."]],
      practice: ["intermediate size와 activation 종류를 config에서 확인한다.", "gate/up/down 각각에 adapter가 실제 주입됐는지 출력한다.", "attention-only와 동일 trainable parameter 예산 비교도 고려한다."],
      prerequisites: ["mlp"],
      next: ["gate-projection", "up-projection", "down-projection", "target-modules"],
      formula: [["SwiGLU 계열", "y = W_down(SiLU(W_gate x) ⊙ W_up x)", "구체적 순서와 bias 사용 여부는 아키텍처별로 다르다."]]
    },
    "nf4-quantization": {
      intuition: "신경망 가중치가 많이 모이는 구간은 촘촘하게, 드문 구간은 넓게 표현하도록 만든 4비트 눈금이다.",
      precise: "정규분포 가중치에 정보 이론적으로 적합하도록 설계된 16개 code point 기반의 4비트 데이터 형식이다. block 단위 absmax normalization과 함께 사용되며 QLoRA의 frozen base storage에 활용된다.",
      mechanism: ["가중치를 block으로 나눈다.", "block scale로 정규화한다.", "가장 가까운 NF4 code point에 매핑한다.", "연산 시 compute dtype으로 dequantize한다."],
      why: "INT4와 단순히 같은 4비트가 아니며 codebook과 block scaling 방식이 품질을 좌우한다.",
      misconceptions: [["NF4는 모든 모델 값이 정규분포라고 보장한다.", "사전학습 가중치의 전형적 분포를 활용한 설계이며 실제 분포와 layer별 특성은 다를 수 있다."], ["NF4 계산 자체가 4비트 행렬곱이다.", "저장 형식과 compute dtype을 구분해야 한다."]],
      practice: ["quant_type, block size, compute dtype, double quant 설정을 기록한다.", "FP16/BF16 base 대비 품질과 peak VRAM을 측정한다."],
      prerequisites: ["quantization", "numeric-precision"],
      next: ["qlora", "double-quantization", "bf16"]
    },
    "mixed-precision-training": {
      intuition: "정확도가 꼭 필요한 계산은 정밀하게, 대량 계산은 가볍게 처리해 속도와 안정성을 모두 얻는 방식이다.",
      precise: "forward/backward/parameter/optimizer state에 서로 다른 dtype을 사용하는 학습 전략이다. Tensor Core 친화적 FP16/BF16 연산과 FP32 누적 또는 master weight를 조합할 수 있다.",
      mechanism: ["모델과 연산의 dtype 정책을 정한다.", "행렬곱을 저정밀도로 수행한다.", "민감한 reduction과 optimizer state는 고정밀도로 유지한다.", "FP16에서는 필요 시 loss scaling으로 underflow를 막는다."],
      why: "메모리 절감과 속도 향상이 크지만 dtype 선택을 잘못하면 NaN, overflow, convergence 저하가 발생한다.",
      misconceptions: [["모든 값을 16비트로 바꾸는 것이다.", "연산별로 다른 정밀도를 섞는 것이 핵심이다."], ["BF16이 FP16보다 항상 정확하다.", "BF16은 범위가 넓고 가수 정밀도는 낮으므로 작업과 하드웨어에 따라 다르다."]],
      practice: ["compute dtype, parameter dtype, optimizer state dtype을 별도로 기록한다.", "NaN/Inf와 gradient norm을 모니터링한다.", "동일 batch 기준 throughput과 최종 품질을 비교한다."],
      prerequisites: ["numeric-precision"],
      next: ["fp16", "bf16", "gradient-scaling", "gradient-checkpointing"]
    },
    "paired-evaluation": {
      intuition: "서로 다른 시험지를 준 두 학생의 평균이 아니라, 같은 문제에서 두 답을 한 쌍으로 놓고 비교하는 방식이다.",
      precise: "동일 평가 단위 i에서 두 시스템의 결과 A_i와 B_i를 관측하고 차이 D_i=A_i−B_i의 분포를 분석하는 설계다. 사례 난이도나 seed 효과를 공통 요인으로 제거해 비교 효율을 높인다.",
      mechanism: ["동일한 입력·seed를 두 설정에 배정한다.", "각 사례에서 동일 지표를 계산한다.", "사례별 차이를 만든다.", "차이의 평균·분포·신뢰구간을 분석한다."],
      why: "r16과 r32가 서로 다른 seed나 다른 평가 문항을 사용하면 설정 효과와 우연한 난이도 차이가 섞인다.",
      misconceptions: [["두 평균을 빼면 모두 paired 평가다.", "관측 단위가 명시적으로 대응되고 차이를 보존해야 한다."], ["paired면 표본이 작아도 확정할 수 있다.", "분산은 줄일 수 있지만 표본 수와 대표성 문제는 남는다."]],
      practice: ["sample ID와 seed ID를 결과에 보존한다.", "aggregate 전에 paired raw difference를 저장한다.", "이진 오류율은 McNemar나 paired bootstrap 등 데이터에 맞는 방법을 고려한다."],
      prerequisites: ["evaluation-metric", "seed"],
      next: ["effect-size", "confidence-interval", "multi-seed-evaluation"]
    },
    "effect-size": {
      intuition: "차이가 우연인지뿐 아니라, 실제로 얼마나 큰 차이인지를 보여 주는 숫자다.",
      precise: "두 조건 간 차이의 실질적 크기를 측정하는 통계량이다. 연속값의 standardized mean difference, 비율의 risk difference·risk ratio, paired error의 절대 %p 차이 등 자료형에 맞는 척도를 선택한다.",
      mechanism: ["주지표의 척도와 분포를 확인한다.", "절대 차이를 계산한다.", "필요하면 표준화 또는 상대 차이를 계산한다.", "신뢰구간과 함께 해석한다."],
      why: "p-value가 작아도 개선이 0.1%p라면 운영 전환 가치가 없을 수 있고, 작은 표본에서 큰 개선은 유의하지 않아도 실험 확대 가치가 있다.",
      misconceptions: [["상대 63% 감소는 63%p 감소다.", "18.3%→6.7%는 절대 11.6%p, 상대 약 63% 감소다."], ["효과 크기가 크면 원인이 증명된다.", "교란 없는 실험 설계가 별도로 필요하다."]],
      practice: ["절대 %p 차이와 상대 변화율을 함께 보고한다.", "비용·latency 변화도 효과 크기로 표현한다.", "사전 정의한 최소 실무 중요 차이와 비교한다."],
      prerequisites: ["evaluation-metric", "paired-evaluation"],
      next: ["confidence-interval", "statistical-significance"]
    },
    "confidence-interval": {
      intuition: "측정한 한 숫자 주변에 어느 정도의 불확실성이 있는지 범위로 보여 주는 방법이다.",
      precise: "반복 표본 추출 절차의 coverage를 기준으로 구성되는 구간 추정량이다. 95% CI는 동일 절차를 반복할 때 생성된 구간의 약 95%가 고정된 참값을 포함하도록 설계된다.",
      mechanism: ["추정하려는 효과를 정의한다.", "표본 구조에 맞는 표준오차 또는 bootstrap을 선택한다.", "반복 표본에서 효과 분포를 계산한다.", "정해진 분위수나 공식을 이용해 구간을 만든다."],
      why: "평균만 보고하면 세 seed 또는 작은 골든셋의 불확실성을 숨기게 된다.",
      misconceptions: [["참값이 현재 구간에 있을 확률이 95%다.", "빈도주의 CI의 직접 해석은 반복 절차의 coverage이며, 확률적 참값 해석은 베이지안 credible interval과 다르다."], ["구간이 0을 포함하면 두 모델은 같다.", "증거가 부족하다는 뜻이지 동등성이 증명된 것은 아니다."]],
      practice: ["문항과 seed의 계층 구조를 보존한 bootstrap을 고려한다.", "효과 크기와 구간을 함께 시각화한다.", "매우 적은 seed에서는 결론 강도를 낮춰 표현한다."],
      prerequisites: ["effect-size"],
      next: ["statistical-significance", "multi-seed-evaluation"]
    },
    "multiple-comparisons": {
      intuition: "동전을 아주 많이 던지면 우연히 연속 앞면이 나오는 것처럼, 설정을 많이 시험하면 우연한 최고점이 생기는 문제다.",
      precise: "여러 가설·설정·지표를 동시에 탐색할 때 family-wise error 또는 false discovery가 증가하고, 최고 설정의 성능이 선택 편향으로 과대평가되는 현상이다.",
      mechanism: ["비교 횟수가 증가한다.", "각 비교의 측정 잡음에서 극단값이 나온다.", "최고값만 선택하면 긍정 잡음이 선택된다.", "같은 validation set에서 반복하면 선택 기준에 과적합된다."],
      why: "rank×alpha×target×seed를 대량 탐색한 뒤 최고 한 run만 production 후보로 삼으면 재현성이 낮을 수 있다.",
      misconceptions: [["각 실험의 p<0.05면 전체 결론도 5% 오류다.", "여러 검정 전체에서 적어도 하나의 거짓 양성이 날 확률은 더 커진다."], ["Bonferroni만 쓰면 해결된다.", "보정 외에도 별도 holdout, 사전 계획, 후보 축소가 중요하다."]],
      practice: ["주지표와 비교군을 사전에 정한다.", "탐색용 validation과 최종 confirmation set을 분리한다.", "모든 run과 실패를 기록하고 최고값만 보고하지 않는다."],
      prerequisites: ["grid-search", "validation-set"],
      next: ["test-set", "statistical-significance", "reproducibility"]
    },
    "contract-compliance": {
      intuition: "답변이 JSON처럼 보이는 것뿐 아니라, 프로그램과 서비스가 약속한 모든 규칙을 실제로 지켰는지를 뜻한다.",
      precise: "출력 instance가 serialization syntax, schema type/required/enum, cross-field invariant, domain policy, provenance 요구를 만족하는 정도다. 각 계층은 서로 다른 validator로 검사할 수 있다.",
      mechanism: ["문자열을 파싱한다.", "JSON Schema를 검증한다.", "필드 간 비즈니스 규칙을 검사한다.", "입력 근거와 값을 대조한다.", "실패 유형별 repair 또는 fallback을 적용한다."],
      why: "strict grammar가 schema 형식을 보장해도 전략 판단이나 근거가 틀리면 서비스 계약은 실패한다.",
      misconceptions: [["JSON parse 성공률이 계약 준수율이다.", "구문은 가장 낮은 단계일 뿐이다."], ["schema는 모든 업무 규칙을 표현할 수 있다.", "외부 데이터 조회와 복잡한 의미 관계는 애플리케이션 검증이 필요하다."]],
      practice: ["syntax/schema/business/grounding 성공률을 분리한다.", "first-pass와 repair 후 최종 성공률을 모두 기록한다.", "오류 path와 원인을 구조화 로그로 남긴다."],
      prerequisites: ["structured-output", "api-contract"],
      next: ["syntactic-validity", "semantic-validity", "business-rule-validation", "repair-loop"]
    },
    "schema-compilation": {
      intuition: "사람이 읽는 JSON 설계도를 생성 엔진이 실행할 수 있는 문법 규칙으로 번역하는 단계다.",
      precise: "declarative schema를 grammar, automaton 또는 token constraint representation으로 변환하고 유효성을 검사하는 전처리 단계다. 모델 forward pass 전에 발생할 수 있으며 지원하지 않는 schema feature에서 실패한다.",
      mechanism: ["schema draft와 keyword를 파싱한다.", "참조와 조합 규칙을 해석한다.", "내부 grammar/state machine을 생성한다.", "접근 불가능 상태나 모순을 검사한다.", "decoder에 compiled constraint를 전달한다."],
      why: "peg-native 오류가 이 단계에서 발생하면 3B 모델이 형식을 못 지킨 것이 아니라 runtime이 제약을 준비하지 못한 것이다.",
      misconceptions: [["컴파일 실패는 모델 출력 오류다.", "생성 전에 실패할 수 있어 모델 크기와 무관하다."], ["유효한 JSON Schema면 모든 runtime에서 컴파일된다.", "runtime마다 지원하는 draft와 keyword subset이 다르다."]],
      practice: ["최소 schema로 축소해 실패 keyword를 찾는다.", "runtime 버전과 schema hash를 기록한다.", "compile failure와 generation failure를 다른 오류 코드로 분리한다."],
      prerequisites: ["json-schema", "parser"],
      next: ["peg-grammar", "constrained-decoding", "production-parity-evaluation"]
    },
    "constrained-decoding": {
      intuition: "모델이 다음 토큰을 고를 때 문법상 불가능한 선택지를 미리 지워 버리는 방식이다.",
      precise: "현재 prefix와 constraint state를 바탕으로 허용 token mask를 계산하고 logits에 적용하는 decoding procedure다. 정규식, CFG/PEG, finite-state automaton, JSON Schema-derived grammar를 사용할 수 있다.",
      mechanism: ["현재 grammar state를 읽는다.", "토크나이저 vocabulary 중 가능한 다음 token을 계산한다.", "불가능 token의 logit을 -∞로 마스킹한다.", "남은 후보에서 greedy 또는 sampling한다.", "새 token으로 grammar state를 전이한다."],
      why: "형식 실패를 줄이는 강력한 방법이지만 token mask 계산 비용과 runtime 호환성 문제가 있으며 의미 정확성은 보장하지 않는다.",
      misconceptions: [["제약 디코딩은 모델을 재학습한다.", "추론 시 후보 선택을 제한할 뿐 가중치는 바꾸지 않는다."], ["허용 token이 하나면 항상 올바른 의미다.", "문법상 유효한 거짓 값도 생성할 수 있다."]],
      practice: ["grammar on/off의 latency와 first-pass success를 비교한다.", "schema compile·decode·parse·semantic 오류를 단계별 측정한다.", "tokenizer 변경 시 grammar 호환성을 다시 검사한다."],
      prerequisites: ["decoder", "schema-compilation"],
      next: ["syntactic-validity", "contract-compliance", "train-serve-eval-skew"]
    },
    "semantic-validity": {
      intuition: "문법과 형식은 맞지만, 그 안에 담긴 내용과 관계까지 실제로 맞는 상태다.",
      precise: "well-formed·schema-valid instance가 도메인 의미, 입력 근거, 필드 간 invariant, 외부 세계 상태와 일치하는 속성이다. 일반적으로 정적 schema만으로 완전히 판정할 수 없다.",
      mechanism: ["구조화 출력의 주장과 필드를 추출한다.", "입력·DB·API 근거와 대조한다.", "필드 간 조건을 평가한다.", "도메인 규칙 위반과 모순을 분류한다."],
      why: "E 첨삭 결과가 정상 JSON이어도 원문에 없는 문제를 지적하거나 수정문 의미를 바꾸면 semantic failure다.",
      misconceptions: [["schema-valid면 semantic-valid다.", "schema는 주로 구조와 국소 제약을 확인한다."], ["LLM judge 하나면 의미를 완벽히 검증한다.", "judge도 오류와 편향이 있어 규칙·근거 대조·다중 판정이 필요하다."]],
      practice: ["원자적 주장 단위로 근거를 연결한다.", "deterministic domain rule을 우선 사용한다.", "judge 평가에는 블라인드와 평가자 일치도를 적용한다."],
      prerequisites: ["syntactic-validity", "business-rule-validation"],
      next: ["grounding", "paired-evaluation", "inter-rater-reliability"]
    },
    "production-parity-evaluation": {
      intuition: "실제 서비스가 달리는 길과 똑같은 길로 모델을 시험하는 평가다.",
      precise: "production의 model artifact, quantization, prompt template, retrieval, runtime, decoding, schema/validator, retry/fallback, timeout을 재현한 end-to-end evaluation이다.",
      mechanism: ["production configuration을 immutable manifest로 캡처한다.", "동일 요청 경로로 평가 샘플을 실행한다.", "각 stage의 latency와 오류를 수집한다.", "최종 사용자 응답과 내부 first-pass 결과를 분리 평가한다.", "stress suite와 별도 보고한다."],
      why: "strict json_schema 평가와 json_object+repair production을 같은 지표로 비교하면 실제 장애율을 잘못 추정한다.",
      misconceptions: [["production parity면 별도 단위 평가가 필요 없다.", "원인 격리를 위해 component·stress test도 필요하다."], ["같은 모델 이름이면 parity다.", "artifact SHA, prompt, runtime, quantization, timeout까지 같아야 한다."]],
      practice: ["모델·prompt·schema·runtime SHA를 결과에 저장한다.", "first-pass, repair, fallback, final success와 latency를 측정한다.", "production 변경 시 parity suite를 release gate로 실행한다."],
      prerequisites: ["inference", "contract-compliance"],
      next: ["train-serve-eval-skew", "regression-test", "benchmark"]
    }
  };

  window.AIDICTIONARY_DETAILS = Object.assign(window.AIDICTIONARY_DETAILS || {}, extraDetails);
})();
