(() => {
  window.AIDICTIONARY_DETAILS = {
  "parameter": {
    "intuition": "모델이 학습하면서 스스로 바꾸는 수많은 내부 다이얼이다. 사람이 문장마다 직접 값을 정하는 것이 아니라, 데이터에서 오차를 줄이는 과정이 이 값들을 조정한다.",
    "precise": "학습 가능한 함수 f(x; θ)에서 θ를 이루는 수치 집합이다. 신경망에서는 선형 계층의 가중치 W와 편향 b, 임베딩 테이블 등이 대표적이다. 학습 과정은 목적함수 L(θ)의 값을 줄이는 θ를 찾는 최적화 문제로 볼 수 있다.",
    "mechanism": [
      "순전파로 현재 파라미터를 사용해 예측을 만든다.",
      "손실 함수로 예측과 목표의 차이를 계산한다.",
      "역전파가 각 파라미터에 대한 gradient를 계산한다.",
      "optimizer가 gradient와 내부 상태를 이용해 파라미터를 업데이트한다."
    ],
    "why": "파라미터 수는 모델 용량과 메모리 요구량의 중요한 지표지만, 데이터 품질·아키텍처·학습법·추론 설정을 무시한 채 파라미터 수만으로 품질을 판단하면 안 된다.",
    "misconceptions": [
      [
        "파라미터가 많으면 무조건 더 좋은 모델이다.",
        "같은 데이터와 계산 예산에서 더 큰 모델이 유리할 수 있지만, 학습 품질·구조·도메인 적합성·양자화 손실 때문에 작은 모델이 특정 작업에서 더 나을 수 있다."
      ],
      [
        "파라미터는 하이퍼파라미터와 같다.",
        "파라미터는 학습으로 갱신되고, 하이퍼파라미터는 학습 전에 사람이 정하는 설정이다."
      ]
    ],
    "practice": [
      "모델 카드에는 총 파라미터 수와 학습 가능한 파라미터 수를 구분해 기록한다.",
      "LoRA 실험에서는 base 전체 파라미터와 adapter trainable 파라미터의 비율을 함께 제시한다."
    ],
    "prerequisites": [],
    "next": [
      "hyperparameter",
      "gradient",
      "optimizer",
      "fine-tuning",
      "lora"
    ],
    "formula": [
      [
        "선형 계층",
        "y = Wx + b",
        "W와 b가 학습 파라미터다."
      ]
    ],
    "sources": [
      [
        "Deep Learning — Goodfellow et al.",
        "https://www.deeplearningbook.org/"
      ]
    ]
  },
  "hyperparameter": {
    "intuition": "학습을 시작하기 전에 사람이 정하는 실험 설정이다. 모델이 무엇을 배우는지가 아니라, 얼마나 오래·얼마나 세게·어떤 구조로 배우게 할지를 결정한다.",
    "precise": "최적화 과정이 직접 갱신하지 않는 모델·학습·데이터 처리의 설정값이다. learning rate, batch size, epoch, regularization, LoRA rank·alpha·target modules 등이 포함된다. 검증 데이터를 이용한 선택 과정까지 포함하면 하이퍼파라미터 최적화 문제다.",
    "mechanism": [
      "후보 공간을 정의한다.",
      "각 설정으로 모델을 학습한다.",
      "동일한 검증셋과 지표로 비교한다.",
      "최종 후보는 독립 테스트셋에서 한 번 평가한다."
    ],
    "why": "여러 하이퍼파라미터가 상호작용하므로 하나씩만 바꾸면 놓치는 조합이 있고, 모든 조합을 돌리면 계산량과 다중 비교 문제가 커진다.",
    "misconceptions": [
      [
        "좋은 값은 모델마다 공통이다.",
        "모델 크기, 데이터 수, optimizer, sequence length, precision에 따라 적절한 값이 달라진다."
      ],
      [
        "검증셋에서 최고인 설정은 확실한 승자다.",
        "많은 조합을 시험할수록 우연히 좋아 보이는 설정을 고를 위험이 있다."
      ]
    ],
    "practice": [
      "탐색 전 주지표와 후보 범위를 문서화한다.",
      "최고 점수뿐 아니라 평균·분산·비용을 함께 비교한다.",
      "최종 테스트셋은 설정 선택에 사용하지 않는다."
    ],
    "prerequisites": [
      "parameter",
      "validation-set"
    ],
    "next": [
      "grid-search",
      "random-search",
      "multi-seed-evaluation",
      "multiple-comparisons"
    ]
  },
  "lora": {
    "intuition": "거대한 원본 모델 전체를 다시 훈련하지 않고, 필요한 변화만 작은 보조 부품에 학습시키는 방법이다.",
    "precise": "동결된 선형 가중치 W에 대해 업데이트 ΔW를 저랭크 행렬 곱 BA로 매개변수화하고, 순전파에서 W + sBA를 사용한다. A와 B만 학습하므로 전체 미세조정보다 trainable parameter와 optimizer state가 크게 줄어든다.",
    "mechanism": [
      "원본 가중치 W를 고정한다.",
      "선택한 target module에 작은 행렬 A와 B를 삽입한다.",
      "A와 B에 대해서만 gradient를 계산하고 업데이트한다.",
      "추론 시 adapter를 별도로 적용하거나 ΔW를 W에 병합한다."
    ],
    "why": "메모리·저장공간·모델별 배포 비용을 줄이면서 특정 작업의 행동 패턴을 학습할 수 있다. 다만 최신 사실 저장, 완전한 지식 갱신, 출력 계약 보장은 LoRA만으로 해결되지 않는다.",
    "tradeoffs": [
      "rank를 높이면 표현 용량과 비용이 함께 증가한다.",
      "target module을 넓히면 더 많은 행동을 바꿀 수 있지만 과적합·망각 위험도 커진다.",
      "adapter 병합 후 양자화하면 배포는 단순해지지만 동적 교체가 어려워진다."
    ],
    "misconceptions": [
      [
        "LoRA는 작은 별도 모델이다.",
        "원본 모델 위에 적용되는 학습 가능한 저랭크 업데이트다."
      ],
      [
        "LoRA를 쓰면 최신 정보를 정확히 기억한다.",
        "행동·형식·도메인 패턴 적응에는 적합하지만 최신 사실은 RAG나 외부 조회가 더 적절하다."
      ],
      [
        "rank가 높을수록 항상 좋다.",
        "데이터와 작업이 요구하는 내재 차원보다 지나치게 크면 비용만 늘거나 과적합될 수 있다."
      ]
    ],
    "practice": [
      "base model, rank, alpha, dropout, target modules, 데이터, seed를 모두 기록한다.",
      "adapter 저장본·병합 모델·양자화 모델을 각각 식별 가능한 SHA로 관리한다.",
      "병합 전후와 양자화 전후의 회귀 평가를 수행한다."
    ],
    "prerequisites": [
      "fine-tuning",
      "low-rank-factorization",
      "parameter"
    ],
    "next": [
      "lora-rank",
      "lora-alpha",
      "target-modules",
      "qlora",
      "adapter-merge"
    ],
    "formula": [
      [
        "LoRA 적용",
        "W′ = W + sBA",
        "B∈R^(d_out×r), A∈R^(r×d_in), s는 scaling 계수다."
      ]
    ],
    "sources": [
      [
        "LoRA: Low-Rank Adaptation of Large Language Models",
        "https://arxiv.org/abs/2106.09685"
      ]
    ]
  },
  "lora-rank": {
    "intuition": "LoRA 보조 부품이 서로 독립적인 변화 방향을 몇 개까지 표현할 수 있는지를 정하는 용량 값이다.",
    "precise": "ΔW = BA에서 내부 차원 r이다. B의 열 수와 A의 행 수가 r이므로 trainable parameter는 한 선형 계층에서 대략 r(d_in+d_out)에 비례한다. r은 ΔW의 수학적 rank 상한이며 실제 유효 랭크와 같다고 보장되지 않는다.",
    "mechanism": [
      "r이 작으면 적은 방향으로만 업데이트를 표현한다.",
      "r이 커지면 더 복잡한 변화 조합을 표현할 수 있다.",
      "동시에 파라미터·메모리·연산·저장량이 거의 선형으로 증가한다.",
      "alpha scaling 규칙에 따라 r 변화가 업데이트 크기까지 바꿀 수 있다."
    ],
    "why": "r16과 r32 비교는 단순 용량 비교가 아닐 수 있다. alpha를 고정하면 scaling도 달라질 수 있고, target module 수가 다르면 총 trainable parameter도 달라진다.",
    "misconceptions": [
      [
        "r32는 r16의 정확히 두 배 품질이다.",
        "표현 용량과 비용은 증가하지만 품질 변화는 데이터·작업·최적화에 따라 비선형적이다."
      ],
      [
        "rank 값만 같으면 실험 조건이 같다.",
        "모델 차원, target module, alpha, dropout, seed가 모두 영향을 준다."
      ],
      [
        "설정한 rank가 모두 활용된다.",
        "학습 후 특이값 분석에서 일부 방향만 실질적으로 사용될 수 있다."
      ]
    ],
    "practice": [
      "rank별 trainable parameter와 VRAM·학습시간을 표에 포함한다.",
      "동일 seed 쌍으로 paired multi-seed 비교를 한다.",
      "grounding, 전략 품질, 형식 준수처럼 서로 다른 지표를 분리한다."
    ],
    "prerequisites": [
      "lora",
      "low-rank-factorization"
    ],
    "next": [
      "lora-alpha",
      "lora-scaling-factor",
      "intrinsic-rank",
      "effective-rank",
      "multi-seed-evaluation"
    ],
    "formula": [
      [
        "어댑터 파라미터 수",
        "r(d_in + d_out)",
        "bias와 여러 module 수는 별도 합산한다."
      ]
    ]
  },
  "lora-alpha": {
    "intuition": "LoRA가 배운 변화의 볼륨을 조절하는 값이지만, 실제 볼륨은 rank와 구현 공식을 함께 봐야 한다.",
    "precise": "LoRA 업데이트에 곱하는 scaling을 구성하는 하이퍼파라미터다. 널리 쓰이는 구현은 s=alpha/r을 사용하지만 rsLoRA 등은 다른 공식을 사용한다. 따라서 alpha 자체를 독립적인 물리량처럼 해석하면 안 된다.",
    "mechanism": [
      "A와 B가 ΔW를 만든다.",
      "runtime이 라이브러리 규칙에 따라 scaling s를 계산한다.",
      "s·ΔW가 원본 W의 출력에 더해진다.",
      "학습 중에는 scaling이 gradient의 유효 크기에도 영향을 준다."
    ],
    "why": "r16/alpha32와 r32/alpha32는 alpha가 같지만 scaling이 다를 수 있다. 반대로 scaling을 맞춘 r16/alpha32와 r32/alpha64는 rank 용량 효과를 더 분리해 볼 수 있다.",
    "misconceptions": [
      [
        "alpha가 클수록 더 많이 학습한다.",
        "optimizer가 업데이트하는 것은 A와 B이고 alpha는 그 효과의 scaling에 관여한다. 과도한 값은 불안정을 만들 수 있다."
      ],
      [
        "alpha/r만 같으면 모든 조건이 동일하다.",
        "rank가 다르면 표현 가능한 업데이트 공간과 파라미터 수는 여전히 다르다."
      ]
    ],
    "practice": [
      "사용 중인 PEFT 구현의 scaling 코드를 확인한다.",
      "rank 효과와 scaling 효과를 분리한 controlled comparison을 설계한다.",
      "alpha sweep 결과는 동일 rank·seed·target에서 비교한다."
    ],
    "prerequisites": [
      "lora",
      "lora-rank"
    ],
    "next": [
      "lora-scaling-factor",
      "rank-stabilized-lora",
      "grid-search"
    ],
    "formula": [
      [
        "전형적 scaling",
        "s = alpha / r",
        "모든 구현에 보편적인 규칙은 아니다."
      ]
    ]
  },
  "target-modules": {
    "intuition": "모델 내부의 어느 부품에 LoRA 보조 회로를 달 것인지 정하는 목록이다.",
    "precise": "PEFT가 adapter를 주입할 선형 또는 유사 모듈의 이름·패턴이다. Transformer에서는 attention projection(q/k/v/o)과 MLP projection(gate/up/down)이 대표적이다. 아키텍처마다 실제 module name이 다르다.",
    "mechanism": [
      "모델의 named modules를 탐색한다.",
      "설정 패턴과 일치하는 계층을 LoRA wrapper로 교체한다.",
      "선택된 모든 계층에 A/B 파라미터가 생긴다.",
      "총 trainable parameter는 rank와 선택 module 크기의 합으로 결정된다."
    ],
    "why": "attention-only와 attention+MLP의 차이는 모델이 바꿀 수 있는 내부 연산 범위를 바꾼다. 단순히 '더 많은 레이어'가 아니라 학습 가능한 함수 공간과 비용을 동시에 바꾸는 실험이다.",
    "misconceptions": [
      [
        "attention-only는 attention 전체를 다시 학습한다.",
        "원본 attention weight는 고정되고 선택 projection에 LoRA 업데이트만 추가된다."
      ],
      [
        "MLP까지 넣으면 무조건 좋아진다.",
        "작은 데이터에서는 과적합과 일반 능력 저하가 늘 수 있다."
      ],
      [
        "모든 모델에서 q_proj라는 이름을 쓴다.",
        "아키텍처와 구현에 따라 query_key_value처럼 합쳐진 이름을 사용할 수 있다."
      ]
    ],
    "practice": [
      "주입 후 실제 trainable module 이름을 출력해 설정이 적용됐는지 검증한다.",
      "비교 시 rank·alpha·데이터·seed를 고정한다.",
      "총 trainable parameter를 맞춘 보조 실험도 고려한다."
    ],
    "prerequisites": [
      "lora",
      "attention",
      "mlp"
    ],
    "next": [
      "q-projection",
      "k-projection",
      "v-projection",
      "o-projection",
      "gated-mlp",
      "ablation-study"
    ]
  },
  "attention": {
    "intuition": "현재 토큰이 문맥의 어떤 부분을 얼마나 참고할지 계산하는 장치다.",
    "precise": "Q와 K의 유사도로 attention weight를 만들고, 이를 V의 가중합에 적용하는 연산이다. 전형적인 scaled dot-product attention은 softmax(QKᵀ/√d_k)V다. causal LLM은 미래 토큰을 볼 수 없도록 mask를 적용한다.",
    "mechanism": [
      "입력에서 Q, K, V를 만든다.",
      "QKᵀ로 토큰 간 점수를 계산한다.",
      "scale과 mask를 적용한 뒤 softmax로 가중치를 만든다.",
      "가중치로 V를 합쳐 문맥 표현을 만든다.",
      "여러 head 결과를 합치고 o_proj를 적용한다."
    ],
    "why": "문장 내 관계와 장거리 의존성을 모델링하지만, attention weight를 곧바로 인간이 이해하는 설명이나 인과적 중요도로 해석하면 안 된다.",
    "misconceptions": [
      [
        "어텐션은 모델이 의식적으로 주목하는 부분이다.",
        "수학적 가중치 연산이며 인간의 주의와 동일하지 않다."
      ],
      [
        "attention weight가 높으면 그 토큰이 답의 원인이다.",
        "상관된 신호일 수 있지만 인과 설명으로 충분하지 않다."
      ],
      [
        "attention-only LoRA는 판단 능력을 바꾸지 못한다.",
        "QKV/O 변화를 통해 정보 결합 방식이 바뀌어 출력 행동도 달라질 수 있다."
      ]
    ],
    "practice": [
      "sequence length 증가에 따른 메모리·지연시간을 측정한다.",
      "GQA/MQA 여부와 Q head·KV head 수를 모델 config에서 확인한다.",
      "LoRA target module이 실제 projection 이름과 일치하는지 검증한다."
    ],
    "prerequisites": [
      "transformer",
      "token",
      "embedding"
    ],
    "next": [
      "attention-head",
      "q-projection",
      "k-projection",
      "v-projection",
      "o-projection",
      "target-modules"
    ],
    "formula": [
      [
        "Scaled dot-product attention",
        "Attention(Q,K,V)=softmax(QKᵀ/√d_k)V",
        "causal mask 등은 softmax 전에 적용한다."
      ]
    ],
    "sources": [
      [
        "Attention Is All You Need",
        "https://arxiv.org/abs/1706.03762"
      ]
    ]
  },
  "mlp": {
    "intuition": "어텐션이 문맥에서 정보를 모은 뒤, 각 토큰 표현을 내부적으로 변환하고 특징을 조합하는 계산 블록이다.",
    "precise": "Transformer block의 position-wise feed-forward network다. 각 토큰 위치에 동일한 함수가 독립적으로 적용되며, 현대 LLM에서는 SwiGLU 같은 gated MLP가 흔하다. attention이 토큰 간 통신을 담당한다면 MLP는 각 위치의 표현 변환과 특징 저장에 중요한 역할을 한다.",
    "mechanism": [
      "hidden vector를 큰 intermediate dimension으로 확장한다.",
      "활성화 함수와 gate를 적용해 비선형 특징을 만든다.",
      "down projection으로 hidden size에 되돌린다.",
      "residual connection을 통해 원래 표현에 더한다."
    ],
    "why": "MLP target까지 LoRA를 적용하면 표현 변환 자체를 더 넓게 조정할 수 있지만 파라미터와 과적합 위험이 증가한다.",
    "misconceptions": [
      [
        "MLP는 단순한 부가 계층이라 중요하지 않다.",
        "Transformer 계산량과 파라미터의 큰 비중을 차지하며 지식·특징 변환에 중요한 역할을 한다."
      ],
      [
        "attention+MLP가 attention-only보다 항상 우수하다.",
        "도메인, 데이터량, rank, regularization에 따라 결과가 달라진다."
      ]
    ],
    "practice": [
      "gate/up/down projection의 module 이름과 intermediate size를 확인한다.",
      "attention-only 대비 총 trainable parameter 차이를 기록한다.",
      "일반 능력 회귀와 도메인 지표를 동시에 평가한다."
    ],
    "prerequisites": [
      "transformer",
      "activation-function"
    ],
    "next": [
      "gated-mlp",
      "gate-projection",
      "up-projection",
      "down-projection",
      "target-modules"
    ]
  },
  "qlora": {
    "intuition": "원본 모델은 4비트로 작게 들고 있고, 학습할 LoRA 부품은 더 높은 정밀도로 유지해 큰 모델을 제한된 GPU에서 튜닝하는 방법이다.",
    "precise": "frozen base weight를 저비트 양자화해 메모리에 저장하고, 역전파는 양자화 가중치를 dequantize한 계산 그래프를 통해 LoRA parameter에 전달하는 PEFT 학습 기법이다. 대표 구성은 NF4, double quantization, paged optimizer다.",
    "mechanism": [
      "base weight를 4비트 형식으로 로드한다.",
      "연산 시 필요한 block을 compute dtype으로 복원해 행렬곱한다.",
      "base는 고정하고 LoRA A/B만 업데이트한다.",
      "optimizer state와 activation memory를 별도로 관리한다."
    ],
    "why": "4비트 저장이 곧 모든 연산이 4비트라는 뜻은 아니다. compute dtype, adapter dtype, optimizer state가 VRAM과 안정성에 크게 영향을 준다.",
    "misconceptions": [
      [
        "QLoRA는 4비트 LoRA를 학습한다.",
        "주로 base model이 4비트이고 LoRA 파라미터는 더 높은 정밀도로 학습된다."
      ],
      [
        "4비트면 메모리가 정확히 1/4이다.",
        "quantization metadata, activation, gradients, optimizer state가 추가로 필요하다."
      ],
      [
        "QLoRA 결과는 곧바로 4비트 배포 모델이다.",
        "학습 방식과 최종 GGUF 양자화·서빙 형식은 별개 단계다."
      ]
    ],
    "practice": [
      "quantization type, compute dtype, double quant, optimizer, gradient checkpointing을 기록한다.",
      "학습 시 peak VRAM과 step time을 측정한다.",
      "adapter merge 후 별도 배포 양자화의 품질 저하를 평가한다."
    ],
    "prerequisites": [
      "lora",
      "quantization",
      "mixed-precision-training"
    ],
    "next": [
      "nf4-quantization",
      "double-quantization",
      "gradient-checkpointing",
      "adapter-merge"
    ],
    "sources": [
      [
        "QLoRA: Efficient Finetuning of Quantized LLMs",
        "https://arxiv.org/abs/2305.14314"
      ]
    ]
  },
  "quantization": {
    "intuition": "모델 숫자를 더 적은 비트로 표현해 저장공간과 메모리를 줄이는 압축 방법이다.",
    "precise": "연속 또는 고정밀 값을 제한된 quantization level과 scale/zero-point로 근사하는 과정이다. weight-only, weight+activation, post-training quantization, quantization-aware training 등 방식이 다르다.",
    "mechanism": [
      "값을 block 또는 tensor 단위로 묶는다.",
      "범위와 분포에 맞는 scale·codebook을 정한다.",
      "고정밀 값을 낮은 비트 code로 매핑한다.",
      "연산 시 직접 저비트 kernel을 사용하거나 dequantize한다."
    ],
    "why": "파일 크기만 보고 속도 향상을 보장할 수 없다. 하드웨어 kernel, memory bandwidth, batch size, context length가 실제 성능을 결정한다.",
    "misconceptions": [
      [
        "4비트 모델은 모든 계산을 4비트로 한다.",
        "가중치 저장만 4비트이고 accumulation은 FP16/BF16/FP32일 수 있다."
      ],
      [
        "양자화하면 항상 빨라진다.",
        "지원 kernel이 없으면 dequantization overhead로 이점이 작거나 느릴 수 있다."
      ],
      [
        "같은 Q4면 품질이 같다.",
        "scheme, block size, calibration, K-quant 종류가 다르면 품질이 달라진다."
      ]
    ],
    "practice": [
      "원본·병합·양자화 모델을 동일 골든셋으로 비교한다.",
      "파일 크기, VRAM, tokens/s, first-token latency를 함께 기록한다.",
      "도메인 grounding과 구조화 출력 회귀를 확인한다."
    ],
    "prerequisites": [
      "numeric-precision",
      "inference"
    ],
    "next": [
      "nf4-quantization",
      "gguf",
      "qlora",
      "mixed-precision-training"
    ]
  },
  "seed": {
    "intuition": "컴퓨터의 무작위 과정을 같은 순서로 다시 재현하기 위한 시작 번호다.",
    "precise": "pseudo-random number generator의 초기 상태를 지정하는 값이다. 데이터 셔플, parameter initialization, dropout mask, sampling 등에 영향을 준다. 그러나 GPU kernel의 비결정성이나 분산 실행 때문에 seed를 같게 해도 완전 동일하지 않을 수 있다.",
    "mechanism": [
      "각 라이브러리의 RNG를 초기화한다.",
      "동일 연산 순서에서 동일 난수열을 생성한다.",
      "난수가 개입된 데이터·학습 동작이 같은 패턴을 따른다.",
      "비결정적 kernel과 환경 차이는 별도 통제가 필요하다."
    ],
    "why": "단일 seed 결과는 하이퍼파라미터 효과와 우연한 초기화 효과를 분리하지 못한다.",
    "misconceptions": [
      [
        "seed 42가 특별히 좋은 값이다.",
        "관례적으로 자주 쓰일 뿐 품질 보장은 없다."
      ],
      [
        "seed만 고정하면 완전 재현된다.",
        "라이브러리·드라이버·kernel·데이터 순서·하드웨어도 고정해야 한다."
      ],
      [
        "여러 seed 중 최고값을 보고하면 된다.",
        "평균과 분산을 보고하지 않으면 선택 편향이 생긴다."
      ]
    ],
    "practice": [
      "Python, NumPy, PyTorch, CUDA RNG를 모두 설정한다.",
      "deterministic option과 성능 저하 여부를 기록한다.",
      "비교 모델은 동일 seed 쌍으로 학습한다."
    ],
    "prerequisites": [
      "reproducibility"
    ],
    "next": [
      "multi-seed-evaluation",
      "paired-evaluation",
      "confidence-interval"
    ]
  },
  "multi-seed-evaluation": {
    "intuition": "같은 실험을 출발점만 바꿔 여러 번 반복해, 한 번의 운이 아닌지 보는 것이다.",
    "precise": "각 configuration을 여러 seed에서 독립 반복하고 지표 분포 또는 paired difference를 분석하는 절차다. 최소 3 seed는 단일 seed보다 낫지만 분산 추정에는 여전히 불확실성이 크다.",
    "mechanism": [
      "비교할 모든 설정에 동일 seed 목록을 사용한다.",
      "seed별 학습·평가 결과를 보존한다.",
      "평균, 중앙값, 표준편차, 최소·최대를 계산한다.",
      "동일 seed 간 차이를 paired 분석한다.",
      "결론 기준을 사전에 정의한다."
    ],
    "why": "r32가 한 seed에서 grounding 오류를 크게 줄였어도 다른 seed에서 뒤집히면 production 전환 근거가 약하다.",
    "misconceptions": [
      [
        "세 seed 모두 이기면 통계적으로 확정이다.",
        "강한 실무 근거는 되지만 표본 수가 작고 평가셋 불확실성도 남는다."
      ],
      [
        "평균만 비교하면 충분하다.",
        "분산과 특정 seed의 실패, 비용·latency도 함께 봐야 한다."
      ]
    ],
    "practice": [
      "seed별 raw output과 evaluator judgment를 저장한다.",
      "평균±표준편차와 paired 차이를 함께 보고한다.",
      "실패 seed를 제외하지 않고 원인을 조사한다."
    ],
    "prerequisites": [
      "seed",
      "evaluation-metric"
    ],
    "next": [
      "paired-evaluation",
      "effect-size",
      "confidence-interval",
      "statistical-significance"
    ]
  },
  "grid-search": {
    "intuition": "미리 정한 설정 조합을 표처럼 전부 돌려보는 방법이다.",
    "precise": "각 하이퍼파라미터의 이산 후보 집합의 Cartesian product를 모두 평가하는 탐색이다. rank 3개와 alpha 3개면 9개 configuration이다. seed와 target family가 추가되면 실험 run 수는 곱셈으로 증가한다.",
    "mechanism": [
      "탐색 축과 후보값을 정의한다.",
      "모든 조합을 생성한다.",
      "동일 학습·평가 프로토콜로 실행한다.",
      "검증 지표와 자원 비용을 수집한다.",
      "최종 후보를 독립 평가한다."
    ],
    "why": "해석은 쉽지만 계산 비효율과 다중 비교, validation overfitting이 문제다.",
    "misconceptions": [
      [
        "9개 중 최고가 진짜 최적값이다.",
        "후보 범위 안의 검증셋 최고일 뿐이며 우연과 측정 오차가 있다."
      ],
      [
        "모든 파라미터를 전부 조합해야 공정하다.",
        "단계적 탐색, random/Bayesian search, controlled ablation이 더 효율적일 수 있다."
      ]
    ],
    "practice": [
      "run 수를 configuration×seed×target×dataset으로 계산한다.",
      "실험 중간에 기준을 바꾸지 않는다.",
      "실패 run과 조기 종료 규칙도 결과에 포함한다."
    ],
    "prerequisites": [
      "hyperparameter",
      "validation-set"
    ],
    "next": [
      "random-search",
      "multiple-comparisons",
      "multi-seed-evaluation",
      "ablation-study"
    ],
    "formula": [
      [
        "실험 수",
        "N = ∏ 후보 수 × seed 수",
        "재학습이 필요한 독립 run 기준이다."
      ]
    ]
  },
  "ablation-study": {
    "intuition": "성능이 왜 좋아졌는지 알기 위해 구성 요소를 하나씩 빼거나 바꿔 보는 실험이다.",
    "precise": "관심 요소 외 조건을 통제한 비교로 각 구성 요소의 기여를 추정한다. 완전한 인과 증명은 아니지만, 여러 변경이 섞인 시스템에서 효과를 분해하는 핵심 방법이다.",
    "mechanism": [
      "baseline을 명확히 정의한다.",
      "한 번에 하나의 요소만 변경한다.",
      "동일 데이터·seed·평가 프로토콜을 사용한다.",
      "차이와 상호작용을 기록한다."
    ],
    "why": "base+schema와 LoRA-no-schema를 비교하면 LoRA와 schema 효과가 혼재된다. LoRA+schema라는 missing cell을 채워야 공정한 비교가 된다.",
    "misconceptions": [
      [
        "두 모델을 비교하면 모두 ablation이다.",
        "관심 요소 외 조건이 통제되어야 한다."
      ],
      [
        "한 요소씩만 보면 상호작용도 알 수 있다.",
        "rank와 alpha처럼 상호작용이 예상되면 factorial design이 필요하다."
      ]
    ],
    "practice": [
      "비교표에 모든 변경 축을 열로 명시한다.",
      "누락된 셀과 실행 불가능한 조건을 정직하게 표시한다.",
      "결론은 측정한 범위 안에서만 표현한다."
    ],
    "prerequisites": [
      "baseline",
      "evaluation-metric"
    ],
    "next": [
      "grid-search",
      "paired-evaluation",
      "multiple-comparisons"
    ]
  },
  "rag": {
    "intuition": "모델의 머릿속 기억만 믿지 않고, 필요한 자료를 찾아서 옆에 펼쳐 놓고 답하게 하는 방식이다.",
    "precise": "질문에 관련된 외부 문서나 레코드를 retrieval하고, 그 결과를 생성 모델의 context에 주입해 답변을 생성하는 아키텍처다. indexing, chunking, embedding, retrieval, reranking, context construction, generation, citation/validation 단계로 구성된다.",
    "mechanism": [
      "문서를 chunk로 나누고 검색 가능한 형태로 저장한다.",
      "질문을 검색 쿼리나 embedding으로 변환한다.",
      "후보 문서를 검색하고 필요하면 rerank한다.",
      "선택 근거를 prompt context에 넣는다.",
      "모델 출력이 근거에 충실한지 검증한다."
    ],
    "why": "최신 일정과 사내 문서에는 적합하지만 검색되지 않은 사실은 제공할 수 없고, 잘못 검색된 근거를 모델이 과신할 수 있다.",
    "misconceptions": [
      [
        "RAG를 붙이면 환각이 사라진다.",
        "검색 실패·오염·문맥 무시·근거 왜곡이 여전히 발생한다."
      ],
      [
        "벡터 DB가 곧 RAG다.",
        "검색 저장소는 한 구성 요소일 뿐 전체 파이프라인이 필요하다."
      ],
      [
        "LoRA와 RAG는 대체 관계다.",
        "LoRA는 행동과 표현 패턴을, RAG는 외부 근거 제공을 담당해 함께 사용할 수 있다."
      ]
    ],
    "practice": [
      "retrieval recall과 generation faithfulness를 분리 평가한다.",
      "문서 출처·시점·권한·신선도를 metadata로 보존한다.",
      "근거가 없을 때 NOT_FOUND를 반환하는 정책을 둔다."
    ],
    "prerequisites": [
      "embedding",
      "semantic-search"
    ],
    "next": [
      "grounding",
      "hallucination",
      "reranking",
      "citation"
    ]
  },
  "grounding": {
    "intuition": "모델이 말을 그럴듯하게 꾸미지 않고, 실제로 주어진 자료에 발을 붙이고 답하는 정도다.",
    "precise": "출력의 주장과 입력·retrieved evidence·도구 결과 사이의 entailment 및 일관성이다. factuality와 겹치지만, grounding은 특히 제공된 근거에 대한 충실성을 강조한다.",
    "mechanism": [
      "출력의 원자적 주장을 추출한다.",
      "각 주장이 어떤 근거에서 지지되는지 연결한다.",
      "근거 없음·모순·과장·조건 누락을 판정한다.",
      "오류율 또는 지원 비율을 계산한다."
    ],
    "why": "모델이 세상 사실을 맞게 말해도 현재 사용자 프로필에 없는 정보를 덧붙이면 해당 작업에서는 grounding 실패다.",
    "misconceptions": [
      [
        "답이 사실이면 grounding도 성공이다.",
        "주어진 근거에서 도출되지 않았다면 grounded하지 않을 수 있다."
      ],
      [
        "출처 링크만 붙이면 grounded하다.",
        "링크 내용이 실제 주장을 지지하는지 확인해야 한다."
      ],
      [
        "낮은 temperature면 grounding이 보장된다.",
        "무작위성은 줄지만 근거 오독과 학습된 추측은 남는다."
      ]
    ],
    "practice": [
      "평가 단위를 문장보다 원자적 주장으로 나눈다.",
      "오류 유형을 fabrication, contradiction, overreach, omission으로 구분한다.",
      "blind paired evaluation과 규칙 기반 검증을 결합한다."
    ],
    "prerequisites": [
      "rag",
      "evidence"
    ],
    "next": [
      "hallucination",
      "citation",
      "semantic-validity",
      "evaluation-metric"
    ]
  },
  "structured-output": {
    "intuition": "모델 답변을 사람이 읽는 자유로운 글이 아니라 프로그램이 처리할 정해진 데이터 모양으로 받는 것이다.",
    "precise": "JSON, XML 또는 schema-defined object처럼 machine-readable contract를 만족하도록 생성·검증하는 패턴이다. prompt-only, JSON mode, constrained decoding, post-validation+repair 등 구현 수준이 다르다.",
    "mechanism": [
      "출력 계약을 정의한다.",
      "생성 단계에서 형식을 유도하거나 제약한다.",
      "parser와 schema validator로 검증한다.",
      "업무 규칙과 grounding을 추가 검증한다.",
      "실패하면 repair·retry·fallback 정책을 적용한다."
    ],
    "why": "형식 성공과 내용 품질은 별도 축이다. schema가 완벽해도 잘못된 판단과 근거 없는 값이 들어갈 수 있다.",
    "misconceptions": [
      [
        "JSON이 파싱되면 성공이다.",
        "타입·필수 필드·enum·업무 규칙·사실성 검증이 남는다."
      ],
      [
        "strict schema면 모델이 더 똑똑해진다.",
        "허용 형식을 제한할 뿐 의미 추론 능력을 높이지 않는다."
      ],
      [
        "repair 후 성공하면 최초 품질도 좋다.",
        "first-pass success와 repair rate를 따로 봐야 한다."
      ]
    ],
    "practice": [
      "구문·스키마·비즈니스·근거 검증 오류를 분리 로깅한다.",
      "production과 동일한 contract path로 parity evaluation을 수행한다.",
      "최종 실패 시 안전한 fallback과 사용자 고지를 설계한다."
    ],
    "prerequisites": [
      "json",
      "api-contract"
    ],
    "next": [
      "json-mode",
      "json-schema",
      "constrained-decoding",
      "contract-compliance",
      "repair-loop"
    ]
  },
  "json-schema": {
    "intuition": "JSON 데이터에 어떤 필드가 있고 각 값이 어떤 종류여야 하는지 적은 설계도다.",
    "precise": "JSON instance의 구조와 제약을 선언적으로 기술하는 표준 vocabulary다. type, properties, required, enum, array items, numeric/string constraints, 조합 키워드 등을 표현할 수 있다. 구현체가 지원하는 draft와 키워드는 다를 수 있다.",
    "mechanism": [
      "schema document를 작성한다.",
      "validator가 JSON instance를 schema에 대조한다.",
      "오류 path와 위반 keyword를 반환한다.",
      "일부 LLM runtime은 schema를 grammar로 컴파일해 생성 후보를 제한한다."
    ],
    "why": "validator 지원 범위와 constrained decoder 지원 범위는 같지 않다. 정상적인 JSON Schema라도 runtime grammar 변환에서 실패할 수 있다.",
    "misconceptions": [
      [
        "JSON Schema는 JSON을 생성한다.",
        "기본 역할은 검증 규칙 정의이며 생성 기능은 도구가 추가로 구현한다."
      ],
      [
        "schema를 통과하면 의미가 맞다.",
        "입력 근거와 필드 간 업무 의미는 별도 검증이 필요하다."
      ],
      [
        "모든 JSON Schema 기능을 LLM grammar가 지원한다.",
        "복잡한 조합·재귀·일부 keyword는 미지원일 수 있다."
      ]
    ],
    "practice": [
      "사용 draft와 runtime 지원 keyword를 고정한다.",
      "최소 재현 schema로 grammar compile failure를 격리한다.",
      "schema validation과 business validation 결과를 별도 지표로 남긴다."
    ],
    "prerequisites": [
      "json",
      "schema"
    ],
    "next": [
      "schema-compilation",
      "constrained-decoding",
      "contract-compliance",
      "semantic-validity"
    ],
    "sources": [
      [
        "JSON Schema Specification",
        "https://json-schema.org/specification"
      ]
    ]
  },
  "grammar-constrained-generation": {
    "intuition": "모델이 다음 글자를 마음대로 고르지 못하게 하고, 정해진 문법상 가능한 토큰만 고르게 하는 생성 방식이다.",
    "precise": "각 decoding step에서 grammar state를 갱신하고 허용 token set을 계산해 logits를 mask하는 constrained decoding이다. CFG/PEG/regex/FSM 등 표현을 사용할 수 있다.",
    "mechanism": [
      "schema나 grammar를 parser state machine으로 준비한다.",
      "현재 생성 prefix에 맞는 허용 token을 계산한다.",
      "금지 token의 logit을 제거한다.",
      "선택 token으로 상태를 전이한다.",
      "accepting state에서 출력을 종료한다."
    ],
    "why": "구문 오류는 줄지만 schema compilation failure, tokenization edge case, decoding overhead가 생길 수 있다. 의미 오류는 막지 못한다.",
    "misconceptions": [
      [
        "작은 모델이라 grammar 엔진이 실패한다.",
        "추론 전 schema compile 오류라면 모델 크기와 무관하다."
      ],
      [
        "grammar ON이면 모든 계약을 만족한다.",
        "표현 가능한 구문 제약만 보장하며 사실성·업무 규칙은 별도다."
      ],
      [
        "grammar OFF 실패와 ON 실패는 같은 원인이다.",
        "compile/runtime/parse/schema/semantic 단계를 구분해야 한다."
      ]
    ],
    "practice": [
      "compile success, generation start, parse success, schema success를 단계별 로깅한다.",
      "동일 prompt에서 grammar on/off를 비교한다.",
      "production runtime 버전과 eval runtime 버전을 맞춘다."
    ],
    "prerequisites": [
      "json-schema",
      "decoder"
    ],
    "next": [
      "schema-compilation",
      "peg-grammar",
      "constrained-decoding",
      "syntactic-validity"
    ]
  },
  "repair-loop": {
    "intuition": "모델이 처음 만든 답이 틀린 형식이면, 구체적인 오류를 알려 주고 다시 고쳐 오게 하는 절차다.",
    "precise": "생성→검증→오류 분류→교정 prompt→재생성의 bounded retry loop다. 동일 입력과 invalid output, validator error를 repair context로 제공할 수 있다.",
    "mechanism": [
      "초기 출력을 파싱한다.",
      "schema와 업무 규칙을 검증한다.",
      "실패 원인을 최소한으로 구조화한다.",
      "temperature를 낮추거나 invalid field만 수정하도록 재요청한다.",
      "최대 횟수 후 fallback한다."
    ],
    "why": "최종 성공률을 높이지만 latency, token cost, 중복 부작용을 증가시킨다. 비멱등 도구 호출을 repair 과정에서 반복하면 위험하다.",
    "misconceptions": [
      [
        "repair가 있으면 모델 품질은 중요하지 않다.",
        "repair rate가 높으면 비용·지연·장애율이 커지고 복구 불가능한 의미 오류가 남는다."
      ],
      [
        "같은 prompt를 재시도하면 repair다.",
        "검증 오류를 이용해 수정 방향을 제공해야 효과적인 repair다."
      ],
      [
        "무제한 재시도하면 결국 성공한다.",
        "반복 루프와 비용 폭주를 막기 위해 엄격한 상한이 필요하다."
      ]
    ],
    "practice": [
      "first-pass success, repair success, final failure를 분리 측정한다.",
      "파싱·schema·business·grounding 오류별 repair prompt를 다르게 한다.",
      "tool side effect는 repair loop 밖에서 idempotency key로 보호한다."
    ],
    "prerequisites": [
      "structured-output",
      "validator"
    ],
    "next": [
      "first-pass-success-rate",
      "repair-rate",
      "fallback",
      "contract-compliance"
    ]
  },
  "train-serve-eval-skew": {
    "intuition": "학습할 때, 실제 서비스할 때, 시험할 때의 조건이 서로 달라 결과를 잘못 해석하는 문제다.",
    "precise": "training distribution/format, serving pipeline, evaluation pipeline 사이의 feature·prompt·schema·preprocessing·runtime·fallback 차이로 인해 offline metric과 production behavior가 불일치하는 현상이다.",
    "mechanism": [
      "각 단계의 입력·전처리·모델·decoder·validator·retry 설정을 목록화한다.",
      "동일해야 할 항목의 차이를 diff한다.",
      "production-parity evaluation과 stress test를 분리한다.",
      "차이로 설명되는 실패를 모델 결함과 구분한다."
    ],
    "why": "eval에서 strict json_schema를 사용하고 production은 json_object+repair를 사용하면 rc=1 실패율과 최종 계약 성공률이 서로 다른 시스템을 측정한다.",
    "misconceptions": [
      [
        "평가가 더 엄격하면 항상 더 좋은 평가다.",
        "목표가 production 품질 추정이라면 실제 경로와 달라 편향될 수 있다."
      ],
      [
        "production에서 안 쓰는 기능의 실패는 무의미하다.",
        "스트레스 테스트로는 가치가 있지만 production 버그라고 단정하면 안 된다."
      ],
      [
        "같은 모델 파일이면 조건이 같다.",
        "prompt, runtime version, quantization, schema, retry, max tokens가 모두 결과에 영향을 준다."
      ]
    ],
    "practice": [
      "환경 매니페스트에 모델 SHA·runtime·prompt·schema·sampling을 저장한다.",
      "production-parity suite와 strict stress suite를 별도 보고한다.",
      "실패 원인을 model, harness, runtime, contract, infrastructure로 분류한다."
    ],
    "prerequisites": [
      "training-set",
      "inference",
      "benchmark"
    ],
    "next": [
      "production-parity-evaluation",
      "ablation-study",
      "contract-compliance"
    ]
  },
  "overfitting": {
    "intuition": "연습문제 답을 외워서 연습장에서는 잘하지만 새로운 문제에서는 못 푸는 상태다.",
    "precise": "학습 위험은 낮지만 모집단 또는 독립 데이터의 기대 위험이 높은 일반화 실패다. 모델 용량, 데이터 수·노이즈, 반복 학습, 선택 편향이 복합적으로 작용한다.",
    "mechanism": [
      "모델이 학습 데이터의 일반 패턴을 익힌다.",
      "계속 최적화하면 희귀한 우연·노이즈까지 맞춘다.",
      "train metric은 개선되지만 validation metric은 정체 또는 악화된다.",
      "하이퍼파라미터를 validation에 반복 맞추면 validation overfitting도 발생한다."
    ],
    "why": "작은 SFT 데이터에 높은 rank와 넓은 target module을 사용하면 도메인 학습과 암기 사이의 경계를 평가해야 한다.",
    "misconceptions": [
      [
        "train loss가 낮으면 좋은 모델이다.",
        "새 데이터에서 성능을 봐야 한다."
      ],
      [
        "LoRA는 파라미터가 적어 과적합하지 않는다.",
        "작은 데이터와 강한 업데이트에서는 충분히 과적합할 수 있다."
      ],
      [
        "validation이 좋으면 끝이다.",
        "많은 실험으로 validation을 반복 선택하면 그 데이터에도 과적합된다."
      ]
    ],
    "practice": [
      "train/validation curve와 시드별 편차를 저장한다.",
      "도메인셋뿐 아니라 일반 능력 회귀셋을 평가한다.",
      "early stopping, data mix, dropout, rank 축소를 비교한다."
    ],
    "prerequisites": [
      "training-set",
      "validation-set"
    ],
    "next": [
      "early-stopping",
      "regularization",
      "catastrophic-forgetting",
      "multiple-comparisons"
    ]
  }
};
})();
