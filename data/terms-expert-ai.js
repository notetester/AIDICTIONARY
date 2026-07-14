(() => {
  const additions = [
  {
    "id": "lora-scaling-factor",
    "term": "LoRA 스케일링 계수",
    "english": "LoRA Scaling Factor",
    "aliases": [
      "LoRA 배율",
      "alpha/r"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "LoRA가 계산한 저랭크 업데이트를 실제 가중치 변화에 얼마나 크게 반영할지 정하는 계수.",
    "description": "전형적인 LoRA 구현은 원래 가중치 W를 직접 바꾸지 않고 ΔW = BA를 학습한 뒤, 순전파에서 W + s·BA를 사용한다. 여기서 s는 흔히 alpha/rank로 정의되지만 라이브러리와 변형 기법에 따라 규칙이 다를 수 있다. 따라서 rank와 alpha를 비교할 때는 숫자 자체가 아니라 실제 구현의 scaling 식을 확인해야 한다.",
    "example": "일반 LoRA에서 r=16, alpha=32라면 scaling이 2일 수 있다. r=32, alpha=32는 scaling이 1이므로 두 설정은 rank뿐 아니라 업데이트 배율도 달라진다.",
    "related": [
      "lora",
      "lora-rank",
      "lora-alpha",
      "rank-stabilized-lora"
    ],
    "keywords": [
      "alpha/r",
      "scaling",
      "delta W",
      "BA"
    ]
  },
  {
    "id": "rank-stabilized-lora",
    "term": "Rank-Stabilized LoRA",
    "english": "Rank-Stabilized LoRA (rsLoRA)",
    "aliases": [
      "rsLoRA",
      "랭크 안정화 LoRA"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "rank가 커질 때 LoRA 업데이트 크기가 지나치게 약해지지 않도록 스케일링 규칙을 바꾼 변형.",
    "description": "일반적인 alpha/r scaling 대신 alpha/√r 같은 규칙을 사용해 rank 증가에 따른 업데이트 신호의 약화를 완화하려는 접근이다. 핵심은 rank를 키웠을 때 표현 용량만 늘고 유효 업데이트는 지나치게 작아지는 문제를 줄이는 것이다. 사용 가능 여부와 정확한 수식은 PEFT 라이브러리 버전과 설정을 확인해야 한다.",
    "example": "r16과 r64를 비교할 때 일반 scaling과 rsLoRA scaling은 실제 업데이트 크기가 다르므로 동일 실험으로 간주하면 안 된다.",
    "related": [
      "lora-scaling-factor",
      "lora-rank",
      "lora-alpha",
      "lora"
    ],
    "keywords": [
      "rsLoRA",
      "sqrt rank",
      "scaling"
    ]
  },
  {
    "id": "dora-adaptation",
    "term": "DoRA",
    "english": "Weight-Decomposed Low-Rank Adaptation",
    "aliases": [
      "Weight-Decomposed LoRA",
      "가중치 분해 적응"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "가중치의 크기와 방향을 분리해 적응시키는 LoRA 계열 기법.",
    "description": "DoRA는 사전학습 가중치를 magnitude와 direction으로 분해하고, 방향 변화에는 저랭크 업데이트를 적용하며 크기 성분도 별도로 학습한다. LoRA보다 전체 미세조정에 가까운 학습 동작을 목표로 하지만 추가 계산과 구현 복잡성이 생길 수 있다.",
    "example": "같은 데이터에서 LoRA와 DoRA를 비교할 때 학습 파라미터 수, 메모리, 병합 방식, 추론 비용을 함께 기록해야 한다.",
    "related": [
      "lora",
      "low-rank-factorization",
      "adapter-merge"
    ],
    "keywords": [
      "DoRA",
      "magnitude",
      "direction"
    ]
  },
  {
    "id": "low-rank-factorization",
    "term": "저랭크 행렬 분해",
    "english": "Low-Rank Matrix Factorization",
    "aliases": [
      "Low-rank decomposition",
      "저차원 행렬 분해"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "큰 행렬의 변화를 두 개의 더 작은 행렬 곱으로 표현하는 방법.",
    "description": "m×n 행렬 전체를 직접 학습하는 대신 m×r 행렬 B와 r×n 행렬 A의 곱 BA로 근사한다. r이 m과 n보다 훨씬 작으면 파라미터와 연산량을 줄일 수 있다. LoRA의 핵심 가정은 특정 작업에 필요한 가중치 변화가 비교적 낮은 내재 차원으로 표현될 수 있다는 것이다.",
    "example": "4096×4096 가중치 전체는 약 1,678만 개 값이지만 r=16의 BA는 약 13만 개 값으로 표현된다.",
    "related": [
      "lora",
      "lora-rank",
      "singular-value-decomposition",
      "intrinsic-rank"
    ],
    "keywords": [
      "matrix",
      "rank",
      "BA",
      "parameter efficient"
    ]
  },
  {
    "id": "intrinsic-rank",
    "term": "내재 랭크",
    "english": "Intrinsic Rank",
    "aliases": [
      "본질적 랭크",
      "내재 차원"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "문제를 해결하는 데 실제로 필요한 변화가 차지하는 유효한 차원의 수.",
    "description": "모델의 가중치 행렬은 매우 크더라도 특정 도메인 적응에 필요한 업데이트는 훨씬 낮은 차원 구조를 가질 수 있다. LoRA의 rank는 이 구조를 표현하기 위한 상한에 가깝고, 실제로 모든 rank 성분이 동일하게 유용한 것은 아니다.",
    "example": "r64로 학습했지만 특이값 대부분이 매우 작다면 실제 유효 변화는 r64보다 낮은 차원에 집중됐을 수 있다.",
    "related": [
      "lora-rank",
      "effective-rank",
      "singular-value-decomposition",
      "low-rank-factorization"
    ],
    "keywords": [
      "intrinsic dimension",
      "rank"
    ]
  },
  {
    "id": "effective-rank",
    "term": "유효 랭크",
    "english": "Effective Rank",
    "aliases": [
      "실효 랭크"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "행렬의 정보가 실질적으로 몇 개의 독립된 방향에 분포하는지 나타내는 개념.",
    "description": "수학적 rank는 0이 아닌 특이값의 개수지만, 실제 수치 계산에서는 매우 작은 성분이 거의 기여하지 않을 수 있다. 유효 랭크는 특이값 분포나 엔트로피 기반 지표를 이용해 정보가 집중된 정도를 본다. LoRA rank가 높아도 유효 랭크가 낮다면 추가 용량이 활용되지 않았을 가능성이 있다.",
    "example": "r32 어댑터의 상위 8개 특이값이 대부분의 에너지를 차지한다면 유효 랭크는 32보다 훨씬 작게 해석될 수 있다.",
    "related": [
      "intrinsic-rank",
      "singular-value-decomposition",
      "lora-rank"
    ],
    "keywords": [
      "singular value",
      "spectrum"
    ]
  },
  {
    "id": "singular-value-decomposition",
    "term": "특이값 분해",
    "english": "Singular Value Decomposition (SVD)",
    "aliases": [
      "SVD"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "행렬을 중요한 방향과 그 중요도인 특이값으로 분해하는 선형대수 기법.",
    "description": "행렬 M을 UΣVᵀ로 분해한다. Σ의 큰 특이값은 행렬이 강하게 작용하는 방향을 나타낸다. 작은 특이값을 버리면 저랭크 근사를 만들 수 있어 압축, 노이즈 제거, 어댑터 분석에 활용된다.",
    "example": "학습된 LoRA 업데이트 BA를 SVD로 분석하면 어떤 rank 성분이 실제로 크게 기여하는지 볼 수 있다.",
    "related": [
      "low-rank-factorization",
      "effective-rank",
      "intrinsic-rank"
    ],
    "keywords": [
      "SVD",
      "linear algebra",
      "spectrum"
    ]
  },
  {
    "id": "attention-head",
    "term": "어텐션 헤드",
    "english": "Attention Head",
    "aliases": [
      "헤드"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "어텐션을 여러 관점으로 병렬 계산하는 하나의 하위 통로.",
    "description": "멀티헤드 어텐션은 hidden state를 여러 head로 나누고 각 head가 독립적인 Q, K, V 투영을 통해 관계를 계산하게 한다. 서로 다른 head가 문법, 위치, 지시 대상 등 서로 다른 패턴을 전문적으로 담당할 수 있지만 실제 역할은 고정되어 있지 않다.",
    "example": "hidden size 4096, head 수 32라면 단순한 구성에서는 head dimension이 128일 수 있다.",
    "related": [
      "attention",
      "head-dimension",
      "q-projection",
      "k-projection",
      "v-projection"
    ],
    "keywords": [
      "multi-head",
      "QKV"
    ]
  },
  {
    "id": "head-dimension",
    "term": "헤드 차원",
    "english": "Head Dimension",
    "aliases": [
      "head_dim"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "각 어텐션 헤드가 사용하는 벡터 공간의 크기.",
    "description": "일반적으로 hidden size를 attention head 수로 나눈 값과 관련되지만, grouped-query attention이나 일부 아키텍처에서는 Q head와 KV head 수가 다를 수 있다. 어텐션 점수는 보통 QKᵀ를 √d_k로 나누어 크기를 안정화한다.",
    "example": "Q와 K의 차원이 128이면 attention score scaling에 √128이 사용되는 전형적 구현이 있다.",
    "related": [
      "attention-head",
      "attention",
      "q-projection",
      "k-projection"
    ],
    "keywords": [
      "d_k",
      "sqrt",
      "dimension"
    ]
  },
  {
    "id": "q-projection",
    "term": "Q 프로젝션",
    "english": "Query Projection (q_proj)",
    "aliases": [
      "q_proj",
      "Query 투영"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "각 토큰이 다른 토큰에서 어떤 정보를 찾을지 나타내는 Query 벡터를 만드는 선형 계층.",
    "description": "입력 hidden state에 W_Q를 곱해 Q를 만든다. 어텐션 점수는 Q와 K의 유사도로 계산된다. LoRA attention-only 구성에서 q_proj는 가장 흔한 target module 중 하나다.",
    "example": "CareerTuner 문장에서 현재 토큰이 'AWS 경험'과 '없다'의 관계를 찾는 데 필요한 질의 표현을 만든다.",
    "related": [
      "attention",
      "k-projection",
      "v-projection",
      "o-projection",
      "target-modules"
    ],
    "keywords": [
      "q_proj",
      "Query",
      "W_Q"
    ]
  },
  {
    "id": "k-projection",
    "term": "K 프로젝션",
    "english": "Key Projection (k_proj)",
    "aliases": [
      "k_proj",
      "Key 투영"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "각 토큰이 어떤 특징으로 검색될지 나타내는 Key 벡터를 만드는 선형 계층.",
    "description": "입력 hidden state에 W_K를 곱해 K를 만든다. Q와 K의 내적은 어떤 토큰을 얼마나 참고할지 결정하는 점수의 기반이 된다.",
    "example": "Query가 '경험 여부'를 찾는다면 Key는 각 토큰이 기술명인지, 부정 표현인지 같은 검색 단서를 제공할 수 있다.",
    "related": [
      "attention",
      "q-projection",
      "v-projection",
      "target-modules"
    ],
    "keywords": [
      "k_proj",
      "Key",
      "W_K"
    ]
  },
  {
    "id": "v-projection",
    "term": "V 프로젝션",
    "english": "Value Projection (v_proj)",
    "aliases": [
      "v_proj",
      "Value 투영"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "어텐션으로 선택된 뒤 실제로 전달될 정보인 Value 벡터를 만드는 계층.",
    "description": "입력 hidden state에 W_V를 곱해 V를 만든다. Q-K 점수로 계산한 가중치가 V를 가중합해 문맥 표현을 만든다. 즉 K는 찾기 위한 주소에 가깝고 V는 가져올 내용에 가깝다.",
    "example": "모델이 AWS 관련 토큰에 높은 가중치를 주면 해당 토큰의 V 표현이 현재 토큰 표현에 더 크게 반영된다.",
    "related": [
      "attention",
      "q-projection",
      "k-projection",
      "o-projection",
      "target-modules"
    ],
    "keywords": [
      "v_proj",
      "Value",
      "W_V"
    ]
  },
  {
    "id": "o-projection",
    "term": "O 프로젝션",
    "english": "Output Projection (o_proj)",
    "aliases": [
      "o_proj",
      "출력 투영"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "여러 어텐션 헤드의 결과를 다시 모델 hidden space로 합치는 선형 계층.",
    "description": "각 head의 출력을 이어 붙인 뒤 W_O를 적용해 다음 잔차 연결에 더할 표현을 만든다. attention-only LoRA 구성에는 q_proj, k_proj, v_proj와 함께 o_proj가 자주 포함된다.",
    "example": "32개 head가 만든 문맥 표현을 합쳐 모델의 원래 hidden size로 되돌린다.",
    "related": [
      "attention",
      "attention-head",
      "q-projection",
      "v-projection",
      "target-modules"
    ],
    "keywords": [
      "o_proj",
      "output projection",
      "W_O"
    ]
  },
  {
    "id": "gated-mlp",
    "term": "게이트형 MLP",
    "english": "Gated MLP",
    "aliases": [
      "Gated FFN",
      "GLU 계열 MLP"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "한 경로가 다른 경로의 정보 통과량을 조절하는 Transformer의 피드포워드 블록.",
    "description": "현대 LLM에서는 단순한 두 층 MLP 대신 SwiGLU 같은 게이트 구조를 자주 사용한다. 전형적으로 up projection과 gate projection의 결과를 원소별로 결합한 뒤 down projection으로 hidden size에 되돌린다.",
    "example": "SwiGLU 계열에서는 activation(gate_proj(x)) × up_proj(x)를 계산한 뒤 down_proj를 적용한다.",
    "related": [
      "mlp",
      "gate-projection",
      "up-projection",
      "down-projection",
      "target-modules"
    ],
    "keywords": [
      "SwiGLU",
      "FFN",
      "gating"
    ]
  },
  {
    "id": "gate-projection",
    "term": "Gate 프로젝션",
    "english": "Gate Projection (gate_proj)",
    "aliases": [
      "gate_proj"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "MLP에서 어떤 특징을 얼마나 통과시킬지 조절하는 게이트 값을 만드는 계층.",
    "description": "게이트형 MLP에서 입력을 중간 차원으로 투영하고 활성화 함수를 거쳐 up projection 경로를 조절한다. attention+MLP LoRA 실험에서 자주 추가되는 target module이다.",
    "example": "gate_proj가 특정 직무 조건과 관련된 특징을 강조하거나 억제하는 표현을 학습할 수 있다.",
    "related": [
      "gated-mlp",
      "up-projection",
      "down-projection",
      "target-modules"
    ],
    "keywords": [
      "gate_proj",
      "SwiGLU"
    ]
  },
  {
    "id": "up-projection",
    "term": "Up 프로젝션",
    "english": "Up Projection (up_proj)",
    "aliases": [
      "up_proj"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "hidden vector를 더 넓은 중간 차원으로 확장하는 MLP 선형 계층.",
    "description": "Transformer MLP는 보통 hidden size보다 큰 intermediate size에서 비선형 변환을 수행한다. up_proj는 이 확장을 담당하며 gate_proj와 결합되기도 한다.",
    "example": "hidden size 4096을 intermediate size 11008로 확장하는 계층이 up projection이다.",
    "related": [
      "gated-mlp",
      "gate-projection",
      "down-projection",
      "mlp"
    ],
    "keywords": [
      "up_proj",
      "intermediate size"
    ]
  },
  {
    "id": "down-projection",
    "term": "Down 프로젝션",
    "english": "Down Projection (down_proj)",
    "aliases": [
      "down_proj"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "MLP의 넓은 중간 표현을 다시 모델 hidden size로 줄이는 계층.",
    "description": "비선형 변환을 마친 intermediate representation을 residual stream에 더할 수 있는 차원으로 되돌린다. MLP까지 LoRA를 적용할 때 gate/up/down projection을 함께 타깃으로 삼는 경우가 많다.",
    "example": "11008차원 중간 표현을 4096 hidden dimension으로 되돌린다.",
    "related": [
      "gated-mlp",
      "up-projection",
      "gate-projection",
      "target-modules"
    ],
    "keywords": [
      "down_proj",
      "FFN"
    ]
  },
  {
    "id": "nf4-quantization",
    "term": "NF4 양자화",
    "english": "NormalFloat 4-bit (NF4)",
    "aliases": [
      "NF4",
      "NormalFloat4"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "정규분포에 가까운 신경망 가중치를 효율적으로 표현하도록 설계된 4비트 데이터 형식.",
    "description": "QLoRA에서 널리 알려진 4비트 양자화 형식이다. 균등 간격 정수 양자화와 달리 정규분포 가중치의 분위수에 맞춘 표현 수준을 사용해 정보 손실을 줄이는 것을 목표로 한다. 실제 계산은 더 높은 정밀도로 수행될 수 있다.",
    "example": "기본 모델 가중치는 NF4로 저장하고 LoRA 파라미터와 계산은 BF16으로 수행하는 구성이 가능하다.",
    "related": [
      "qlora",
      "quantization",
      "double-quantization",
      "bf16"
    ],
    "keywords": [
      "NF4",
      "4bit",
      "bitsandbytes"
    ]
  },
  {
    "id": "double-quantization",
    "term": "이중 양자화",
    "english": "Double Quantization",
    "aliases": [
      "Double quant"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "양자화에 필요한 스케일 상수까지 다시 양자화해 메모리를 추가로 줄이는 기법.",
    "description": "저비트 가중치를 복원하려면 블록별 quantization constant가 필요하다. 이 상수 자체도 메모리를 차지하므로 다시 양자화해 평균 메모리 비용을 줄인다. QLoRA의 메모리 절약 구성에서 함께 언급된다.",
    "example": "4비트 모델 가중치뿐 아니라 각 블록의 scale metadata도 압축한다.",
    "related": [
      "nf4-quantization",
      "qlora",
      "quantization"
    ],
    "keywords": [
      "double quant",
      "scale"
    ]
  },
  {
    "id": "gradient-checkpointing",
    "term": "그래디언트 체크포인팅",
    "english": "Gradient Checkpointing",
    "aliases": [
      "Activation checkpointing",
      "활성값 체크포인팅"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "일부 중간 활성값을 저장하지 않고 역전파 때 다시 계산해 GPU 메모리를 줄이는 기법.",
    "description": "일반 학습은 역전파에 필요한 activation을 저장한다. 체크포인팅은 선택한 지점만 저장하고 나머지는 재계산한다. 메모리를 아끼는 대신 추가 순전파 계산 때문에 학습 속도가 느려질 수 있다.",
    "example": "더 긴 sequence나 큰 batch를 사용하기 위해 gradient checkpointing을 켜되 step time 증가를 측정한다.",
    "related": [
      "gradient",
      "backpropagation",
      "mixed-precision-training",
      "qlora"
    ],
    "keywords": [
      "activation memory",
      "recompute"
    ]
  },
  {
    "id": "mixed-precision-training",
    "term": "혼합 정밀도 학습",
    "english": "Mixed-Precision Training",
    "aliases": [
      "Mixed precision"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "연산과 저장에 여러 숫자 정밀도를 함께 사용해 속도와 메모리 효율을 높이는 학습 방식.",
    "description": "행렬 연산은 FP16 또는 BF16으로 수행하고, 일부 누적값이나 민감한 연산은 FP32로 유지할 수 있다. 하드웨어 지원과 수치 안정성에 따라 적합한 형식을 선택한다.",
    "example": "모델 연산은 BF16, 옵티마이저 상태 일부는 FP32로 유지하는 구성이 있다.",
    "related": [
      "fp16",
      "bf16",
      "gradient-scaling",
      "quantization"
    ],
    "keywords": [
      "AMP",
      "precision",
      "tensor core"
    ]
  },
  {
    "id": "fp16",
    "term": "FP16",
    "english": "IEEE Float16",
    "aliases": [
      "Half precision",
      "반정밀도"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "16비트 부동소수점 형식으로, 메모리와 연산량을 줄이지만 표현 범위가 좁다.",
    "description": "부호 1비트, 지수 5비트, 가수 10비트 구조를 사용한다. 작은 수와 큰 수를 표현하는 범위가 제한되어 gradient underflow나 overflow가 발생할 수 있어 loss scaling을 함께 쓰기도 한다.",
    "example": "FP32 대신 FP16 activation을 사용하면 대략 절반의 메모리로 저장할 수 있다.",
    "related": [
      "mixed-precision-training",
      "bf16",
      "gradient-scaling"
    ],
    "keywords": [
      "float16",
      "half"
    ]
  },
  {
    "id": "bf16",
    "term": "BF16",
    "english": "BFloat16",
    "aliases": [
      "Brain Floating Point 16"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "FP32와 같은 지수 비트 수를 유지해 넓은 표현 범위를 갖는 16비트 부동소수점 형식.",
    "description": "부호 1비트, 지수 8비트, 가수 7비트다. FP16보다 정밀한 소수 표현은 적지만 큰 값과 작은 값을 다룰 범위가 넓어 딥러닝 학습에서 안정적인 경우가 많다. GPU가 BF16을 효율적으로 지원하는지 확인해야 한다.",
    "example": "RTX 4090처럼 BF16 연산을 지원하는 GPU에서는 LLM 학습 compute dtype으로 BF16을 선택할 수 있다.",
    "related": [
      "mixed-precision-training",
      "fp16",
      "qlora"
    ],
    "keywords": [
      "bfloat16",
      "precision"
    ]
  },
  {
    "id": "gradient-scaling",
    "term": "그래디언트 스케일링",
    "english": "Gradient Scaling",
    "aliases": [
      "Loss scaling"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "저정밀도 학습에서 너무 작은 gradient가 0으로 사라지는 것을 막기 위해 loss를 확대하는 기법.",
    "description": "역전파 전에 loss에 큰 scale을 곱해 gradient를 표현 가능한 범위로 올리고, 파라미터 업데이트 전에 다시 나눈다. 동적 loss scaling은 overflow 여부를 보고 scale을 자동 조절한다.",
    "example": "FP16 학습에서 inf가 감지되면 해당 step을 건너뛰고 scale을 줄일 수 있다.",
    "related": [
      "fp16",
      "mixed-precision-training",
      "gradient"
    ],
    "keywords": [
      "loss scaling",
      "underflow"
    ]
  },
  {
    "id": "multi-seed-evaluation",
    "term": "멀티시드 평가",
    "english": "Multi-Seed Evaluation",
    "aliases": [
      "다중 시드 평가"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "같은 설정을 여러 랜덤 시드로 반복해 결과가 우연이 아닌지 확인하는 평가.",
    "description": "시드는 초기화, 데이터 셔플, dropout, 샘플링 등에 영향을 준다. 단일 시드의 최고값보다 평균, 표준편차, 각 시드의 paired difference를 함께 봐야 한다. 시드 수가 적으면 불확실성이 크므로 결론의 강도를 제한해 표현한다.",
    "example": "r16과 r32를 동일한 seed 42·123·7에서 각각 학습해 시드별 grounding 오류율 차이를 비교한다.",
    "related": [
      "seed",
      "paired-evaluation",
      "confidence-interval",
      "effect-size",
      "reproducibility"
    ],
    "keywords": [
      "multi seed",
      "variance",
      "randomness"
    ]
  },
  {
    "id": "paired-evaluation",
    "term": "대응 평가",
    "english": "Paired Evaluation",
    "aliases": [
      "Paired comparison",
      "쌍체 비교"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "두 모델을 동일한 평가 사례나 동일한 시드에 대응시켜 차이를 비교하는 방법.",
    "description": "서로 다른 샘플 집합의 평균을 비교하는 것보다, 같은 문제에서 A와 B의 결과 차이를 계산하면 사례 난이도에 따른 변동을 제거할 수 있다. 통계 검정과 신뢰구간도 paired difference에 적용하는 것이 적절하다.",
    "example": "골든셋의 각 문항에서 r32 오류 여부−r16 오류 여부를 계산해 모델 간 차이를 평가한다.",
    "related": [
      "multi-seed-evaluation",
      "effect-size",
      "confidence-interval",
      "blind-evaluation"
    ],
    "keywords": [
      "paired test",
      "same samples"
    ]
  },
  {
    "id": "effect-size",
    "term": "효과 크기",
    "english": "Effect Size",
    "aliases": [
      "효과량"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "차이가 존재하는지를 넘어 그 차이가 실제로 얼마나 큰지 나타내는 값.",
    "description": "표본 수가 크면 아주 작은 차이도 통계적으로 유의할 수 있다. 효과 크기는 평균 차이, 상대 위험, 오즈비, Cohen's d 등 문제에 맞는 척도로 실질적 중요성을 보여 준다. 모델 평가에서는 절대 오류율 감소와 상대 감소를 함께 제시하면 해석이 쉬워진다.",
    "example": "오류율이 18.3%에서 6.7%로 감소하면 절대 감소는 11.6%p이며 상대 감소는 약 63%다.",
    "related": [
      "statistical-significance",
      "confidence-interval",
      "paired-evaluation",
      "evaluation-metric"
    ],
    "keywords": [
      "Cohen d",
      "absolute difference",
      "relative reduction"
    ]
  },
  {
    "id": "confidence-interval",
    "term": "신뢰구간",
    "english": "Confidence Interval",
    "aliases": [
      "CI"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "표본으로 계산한 성능 차이의 불확실성을 범위로 표현한 것.",
    "description": "예를 들어 95% 신뢰구간은 동일 절차를 반복했을 때 만들어지는 구간 중 약 95%가 참값을 포함하도록 설계된 방법이다. '참값이 이 구간에 있을 확률이 95%'라는 베이지안 해석과는 다르다. 데이터 구조에 맞는 bootstrap이나 paired 방법을 사용해야 한다.",
    "example": "r32−r16 grounding 오류율 차이의 bootstrap 95% CI가 0을 넘지 않으면 r32 우위 근거가 강해질 수 있다.",
    "related": [
      "effect-size",
      "statistical-significance",
      "paired-evaluation",
      "multi-seed-evaluation"
    ],
    "keywords": [
      "95% CI",
      "bootstrap",
      "uncertainty"
    ]
  },
  {
    "id": "statistical-significance",
    "term": "통계적 유의성",
    "english": "Statistical Significance",
    "aliases": [
      "유의성",
      "p-value"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "관측된 차이가 특정 귀무가설 아래 우연히 나타나기 어려운지를 판단하는 기준.",
    "description": "p-value가 작다고 효과가 크거나 실무적으로 중요하다는 뜻은 아니다. 검정 가정, 다중 비교, 표본 독립성, 사전 정의한 분석 계획을 함께 고려해야 한다. 모델 실험에서는 효과 크기와 신뢰구간을 함께 보고하는 것이 바람직하다.",
    "example": "alpha 조합을 많이 시험한 뒤 가장 좋은 한 개만 보고하면 다중 비교로 우연한 승자를 고를 위험이 커진다.",
    "related": [
      "effect-size",
      "confidence-interval",
      "grid-search",
      "multiple-comparisons"
    ],
    "keywords": [
      "p-value",
      "null hypothesis"
    ]
  },
  {
    "id": "multiple-comparisons",
    "term": "다중 비교 문제",
    "english": "Multiple Comparisons Problem",
    "aliases": [
      "다중 검정"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "많은 설정을 시험할수록 우연히 좋아 보이는 결과가 나올 가능성이 커지는 문제.",
    "description": "9개 rank-alpha 조합, 여러 target module, 여러 지표를 모두 비교하면 거짓 양성 위험이 누적된다. 별도 검증셋, 사전 정의한 주지표, 보정 방법, 최종 홀드아웃 평가로 관리한다.",
    "example": "54번 학습 중 최고 점수 하나만 선택하면 실제 일반화보다 과대평가될 수 있다.",
    "related": [
      "grid-search",
      "validation-set",
      "test-set",
      "statistical-significance"
    ],
    "keywords": [
      "Bonferroni",
      "selection bias",
      "winner's curse"
    ]
  },
  {
    "id": "blind-evaluation",
    "term": "블라인드 평가",
    "english": "Blind Evaluation",
    "aliases": [
      "익명 평가"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "평가자가 어느 모델의 출력인지 모르게 해 기대와 선입견의 영향을 줄이는 평가.",
    "description": "모델명, 설정, 출력 순서를 숨기고 무작위화한다. 사람이 평가할 때 특히 중요하며, 동일 출력이 여러 평가자에게 배정되는 방식과 평가자 간 일치도도 기록해야 한다.",
    "example": "A와 B 출력의 출처를 숨긴 채 전략 품질을 6개 축으로 평가하고 나중에 모델 ID를 복원한다.",
    "related": [
      "paired-evaluation",
      "inter-rater-reliability",
      "golden-set",
      "benchmark"
    ],
    "keywords": [
      "blind",
      "randomized order",
      "bias"
    ]
  },
  {
    "id": "inter-rater-reliability",
    "term": "평가자 간 신뢰도",
    "english": "Inter-Rater Reliability",
    "aliases": [
      "평가자 일치도"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "여러 평가자가 같은 결과에 얼마나 일관된 판단을 내리는지 나타내는 정도.",
    "description": "단순 일치율 외에 Cohen's kappa, Fleiss' kappa, Krippendorff's alpha, ICC 등을 사용할 수 있다. 척도 종류, 평가자 수, 결측값 여부에 맞는 지표를 골라야 한다.",
    "example": "두 판정자가 APPLY/COMPENSATE/HOLD를 분류한 결과에 Cohen's kappa를 계산한다.",
    "related": [
      "blind-evaluation",
      "golden-set",
      "evaluation-metric"
    ],
    "keywords": [
      "kappa",
      "agreement",
      "annotator"
    ]
  },
  {
    "id": "first-pass-success-rate",
    "term": "1차 성공률",
    "english": "First-Pass Success Rate",
    "aliases": [
      "First try success",
      "초회 성공률"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "재시도나 repair 없이 첫 출력이 모든 요구 조건을 만족한 비율.",
    "description": "최종 성공률만 보면 repair loop가 모델의 불안정성을 가릴 수 있다. 1차 JSON 파싱 성공, 스키마 통과, 의미 검증 통과를 단계별로 측정하면 어디에서 실패하는지 알 수 있다.",
    "example": "100건 중 첫 출력 82건이 유효하고 repair 후 96건이 성공했다면 1차 성공률은 82%, 최종 성공률은 96%다.",
    "related": [
      "repair-rate",
      "repair-loop",
      "contract-compliance",
      "structured-output"
    ],
    "keywords": [
      "first pass",
      "retry",
      "success rate"
    ]
  },
  {
    "id": "repair-rate",
    "term": "Repair 비율",
    "english": "Repair Rate",
    "aliases": [
      "수정 재시도율"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "모델 출력이 최초 검증에 실패해 수정 프롬프트나 재생성을 필요로 한 비율.",
    "description": "repair가 많으면 최종 성공률이 높아도 지연시간과 비용이 증가하고 장애 지점이 늘어난다. 어떤 오류가 repair를 유발했는지 파싱, 스키마, 비즈니스 규칙, 근거 오류로 나눠 측정해야 한다.",
    "example": "형식 오류 8건, 필수 필드 누락 6건, 의미 규칙 위반 4건으로 총 18%가 repair를 거쳤다.",
    "related": [
      "first-pass-success-rate",
      "repair-loop",
      "latency",
      "contract-compliance"
    ],
    "keywords": [
      "retry rate",
      "re-prompt"
    ]
  },
  {
    "id": "contract-compliance",
    "term": "출력 계약 준수",
    "english": "Output Contract Compliance",
    "aliases": [
      "계약 준수율",
      "Schema compliance"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "모델 출력이 API가 요구하는 구조, 타입, 필수값, 업무 규칙을 만족하는 정도.",
    "description": "유효한 JSON이라는 것과 업무 계약을 만족한다는 것은 다르다. 구문 파싱, JSON Schema, enum·범위, 필드 간 조건, 근거 일치 등을 단계적으로 검증해야 한다. constrained decoding은 구문과 일부 스키마를 도울 수 있지만 의미적 정확성은 별도 검증이 필요하다.",
    "example": "decision이 HOLD이면 reasons가 비어 있지 않아야 한다는 조건은 JSON 문법을 넘어선 비즈니스 계약이다.",
    "related": [
      "structured-output",
      "json-schema",
      "semantic-validity",
      "syntactic-validity",
      "repair-loop"
    ],
    "keywords": [
      "schema compliance",
      "API contract",
      "validation"
    ]
  },
  {
    "id": "syntactic-validity",
    "term": "구문적 유효성",
    "english": "Syntactic Validity",
    "aliases": [
      "문법적 유효성"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "출력이 JSON이나 프로그래밍 언어의 문법 규칙에 맞아 파싱 가능한 상태.",
    "description": "중괄호, 따옴표, 쉼표가 올바른 JSON은 구문적으로 유효하다. 하지만 필수 필드가 없거나 값이 사실과 다를 수 있으므로 스키마 및 의미 유효성과 구분해야 한다.",
    "example": "{\"score\":\"high\"}는 JSON 문법은 맞지만 score가 숫자여야 한다면 계약에는 실패한다.",
    "related": [
      "semantic-validity",
      "json-schema",
      "contract-compliance",
      "grammar-constrained-generation"
    ],
    "keywords": [
      "parse",
      "syntax",
      "JSON"
    ]
  },
  {
    "id": "semantic-validity",
    "term": "의미적 유효성",
    "english": "Semantic Validity",
    "aliases": [
      "의미 검증"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "형식이 맞는 출력을 넘어 값의 내용과 관계가 실제 업무 의미에 맞는 상태.",
    "description": "JSON Schema가 타입과 구조를 확인해도 '없는 자격증을 보유했다고 주장'하는 오류는 잡지 못할 수 있다. 입력 근거 대조, 도메인 규칙, 교차 필드 검증, 외부 조회가 필요하다.",
    "example": "프로필에 AWS가 없는데 strengths 배열에 AWS 경력을 넣으면 JSON은 유효해도 의미적으로 무효다.",
    "related": [
      "syntactic-validity",
      "grounding",
      "contract-compliance",
      "business-rule-validation"
    ],
    "keywords": [
      "semantic validation",
      "ground truth"
    ]
  },
  {
    "id": "business-rule-validation",
    "term": "비즈니스 규칙 검증",
    "english": "Business Rule Validation",
    "aliases": [
      "도메인 규칙 검증"
    ],
    "category": "개발·웹",
    "level": "중급",
    "short": "데이터 형식보다 상위의 업무 조건과 필드 간 관계를 검사하는 과정.",
    "description": "스키마가 허용하는 값이라도 서비스 정책상 금지될 수 있다. 규칙 엔진, 명시적 조건문, 데이터베이스 조회 등을 사용해 검증하며 모델에게만 맡기지 않는 것이 중요하다.",
    "example": "자격증 추천 게이트가 OFF이면 recommendation 배열이 비어 있어야 한다는 규칙을 검증한다.",
    "related": [
      "contract-compliance",
      "semantic-validity",
      "validation",
      "rule-engine"
    ],
    "keywords": [
      "domain rule",
      "invariant"
    ]
  },
  {
    "id": "schema-compilation",
    "term": "스키마 컴파일",
    "english": "Schema Compilation",
    "aliases": [
      "Grammar compilation",
      "스키마 변환"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "JSON Schema 같은 선언적 규칙을 디코더가 사용할 문법이나 상태 기계로 변환하는 단계.",
    "description": "strict structured output 구현은 스키마를 CFG, PEG, 정규 표현식 또는 토큰 마스크 계산 구조로 바꿀 수 있다. 지원하지 않는 키워드, 재귀, 복잡한 조합이 있으면 모델 추론 전에 컴파일이 실패할 수 있다.",
    "example": "llama.cpp가 스키마를 grammar로 바꾸는 단계에서 오류가 나면 모델 크기와 무관하게 생성이 시작되지 않을 수 있다.",
    "related": [
      "json-schema",
      "peg-grammar",
      "grammar-constrained-generation",
      "syntactic-validity"
    ],
    "keywords": [
      "compile",
      "grammar",
      "schema"
    ]
  },
  {
    "id": "peg-grammar",
    "term": "PEG 문법",
    "english": "Parsing Expression Grammar (PEG)",
    "aliases": [
      "Parsing Expression Grammar"
    ],
    "category": "개발·웹",
    "level": "고급",
    "short": "문자열이 어떤 규칙으로 구성되는지 순서 있는 선택과 재귀 규칙으로 기술하는 형식 문법.",
    "description": "CFG와 비슷해 보이지만 선택 연산에서 먼저 성공한 규칙을 채택하는 ordered choice가 핵심이다. 일부 LLM 런타임은 구조화 출력을 제한하기 위한 grammar 표현으로 PEG 계열 문법을 사용한다.",
    "example": "JSON 객체의 중괄호, 문자열, 콜론, 쉼표 순서를 grammar로 정의해 허용되지 않는 다음 토큰을 차단한다.",
    "related": [
      "schema-compilation",
      "grammar-constrained-generation",
      "parser",
      "json-schema"
    ],
    "keywords": [
      "PEG",
      "grammar",
      "parser"
    ]
  },
  {
    "id": "json-mode",
    "term": "JSON 모드",
    "english": "JSON Mode",
    "aliases": [
      "json_object",
      "JSON object mode"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "모델 출력이 파싱 가능한 JSON이 되도록 유도하거나 제한하지만 특정 세부 스키마까지는 보장하지 않는 모드.",
    "description": "제품별 의미가 다르지만 일반적으로 유효한 JSON 객체 생성을 목표로 한다. 필드 이름, 필수값, enum, 의미 규칙은 별도 validator와 repair loop가 필요할 수 있다. strict JSON Schema 출력과 구분해야 한다.",
    "example": "프로덕션은 json_object로 생성한 뒤 Java validator가 필수 필드를 검사하고 실패하면 repair할 수 있다.",
    "related": [
      "structured-output",
      "json-schema",
      "repair-loop",
      "contract-compliance"
    ],
    "keywords": [
      "json_object",
      "response format"
    ]
  },
  {
    "id": "constrained-decoding",
    "term": "제약 디코딩",
    "english": "Constrained Decoding",
    "aliases": [
      "Constraint decoding",
      "출력 제한 디코딩"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "생성 단계마다 규칙상 허용되는 토큰만 선택하도록 후보를 제한하는 방식.",
    "description": "문법, 정규식, 스키마, finite-state machine 등을 이용해 다음 토큰 마스크를 계산한다. 형식 위반을 크게 줄일 수 있지만 계산 오버헤드, 스키마 호환성, 토큰화 경계 문제가 생길 수 있으며 내용의 사실성은 보장하지 않는다.",
    "example": "JSON에서 콜론 다음에 문자열만 허용되는 위치라면 숫자나 닫는 괄호 토큰을 후보에서 제거한다.",
    "related": [
      "grammar-constrained-generation",
      "schema-compilation",
      "json-schema",
      "syntactic-validity"
    ],
    "keywords": [
      "token mask",
      "FSM",
      "grammar"
    ]
  },
  {
    "id": "adapter-merge",
    "term": "어댑터 병합",
    "english": "Adapter Merge",
    "aliases": [
      "LoRA merge",
      "merge_and_unload"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "LoRA가 학습한 ΔW를 원본 가중치에 더해 하나의 독립 모델로 만드는 과정.",
    "description": "병합 후에는 별도 adapter 로딩 없이 추론할 수 있지만 원본과 어댑터를 동적으로 교체하기 어렵다. 병합 정밀도, dtype, 양자화 순서가 품질에 영향을 줄 수 있으므로 병합 전후 출력을 비교해야 한다.",
    "example": "BF16 base와 LoRA를 먼저 병합한 뒤 GGUF로 변환하고 Q4_K_M 양자화를 수행한다.",
    "related": [
      "lora",
      "quantization",
      "gguf",
      "inference"
    ],
    "keywords": [
      "merge",
      "adapter",
      "delta W"
    ]
  },
  {
    "id": "catastrophic-forgetting",
    "term": "파국적 망각",
    "english": "Catastrophic Forgetting",
    "aliases": [
      "치명적 망각"
    ],
    "category": "AI·머신러닝",
    "level": "고급",
    "short": "새 작업을 학습하는 동안 기존에 잘하던 능력이 크게 손상되는 현상.",
    "description": "미세조정 데이터가 좁거나 업데이트가 강하면 모델이 일반 능력과 기존 지식을 잃을 수 있다. 원본 모델과의 회귀 평가, 데이터 혼합, 작은 학습률, PEFT, 정규화 등으로 관리한다.",
    "example": "채용 전략 데이터로 학습한 뒤 일반적인 JSON 지시 준수나 비IT 문장 이해가 악화되는지 확인한다.",
    "related": [
      "fine-tuning",
      "domain-adaptation",
      "overfitting",
      "regression-test"
    ],
    "keywords": [
      "forgetting",
      "continual learning"
    ]
  },
  {
    "id": "instruction-tuning",
    "term": "지시 미세조정",
    "english": "Instruction Tuning",
    "aliases": [
      "Instruction fine-tuning"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "지시와 입력을 받아 적절한 응답을 만드는 예시로 모델을 추가 학습하는 방식.",
    "description": "다양한 instruction-response 쌍을 통해 명령 이해와 형식 준수 능력을 높인다. 단순한 도메인 문서 학습과 다르며, 데이터의 지시 다양성·답변 품질·안전 정책이 중요하다.",
    "example": "공고와 프로필을 입력하고 APPLY/COMPENSATE/HOLD 판단 JSON을 출력하는 예시로 학습한다.",
    "related": [
      "supervised-fine-tuning",
      "fine-tuning",
      "prompt",
      "structured-output"
    ],
    "keywords": [
      "instruction data",
      "SFT"
    ]
  },
  {
    "id": "supervised-fine-tuning",
    "term": "지도 미세조정",
    "english": "Supervised Fine-Tuning (SFT)",
    "aliases": [
      "SFT"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "정답 응답이 붙은 입력-출력 데이터로 다음 토큰 손실을 최소화하며 모델을 학습하는 단계.",
    "description": "대화형 LLM 개발에서 사전학습 다음에 수행되는 대표적인 정렬 단계다. 정답의 표현과 오류까지 모델이 모방할 수 있으므로 데이터 품질과 분포가 중요하다. LoRA는 SFT를 수행하는 파라미터 효율적 방법으로 사용할 수 있다.",
    "example": "416개 검증된 전략 JSON 샘플을 causal language modeling loss로 학습한다.",
    "related": [
      "instruction-tuning",
      "fine-tuning",
      "lora",
      "training-set"
    ],
    "keywords": [
      "SFT",
      "supervised",
      "label"
    ]
  },
  {
    "id": "numeric-precision",
    "term": "수치 정밀도",
    "english": "Numerical Precision",
    "aliases": [
      "숫자 정밀도"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "숫자를 몇 비트와 어떤 형식으로 표현해 어느 범위와 세밀도를 보존할지 나타내는 특성.",
    "description": "FP32, FP16, BF16, INT8처럼 비트 수와 표현 방식에 따라 범위, 반올림 오차, 메모리, 연산 성능이 달라진다. 정밀도가 낮다는 말은 단순히 소수점 자리 수가 적다는 뜻이 아니라 exponent와 mantissa 구조까지 포함한다.",
    "example": "BF16은 FP16보다 가수 정밀도는 낮지만 지수 범위가 넓다.",
    "related": [
      "fp16",
      "bf16",
      "mixed-precision-training",
      "quantization"
    ],
    "keywords": [
      "precision",
      "dtype",
      "rounding"
    ]
  },
  {
    "id": "production-parity-evaluation",
    "term": "프로덕션 동등 평가",
    "english": "Production-Parity Evaluation",
    "aliases": [
      "Serving parity evaluation"
    ],
    "category": "LLM·생성형 AI",
    "level": "고급",
    "short": "실제 서비스와 같은 모델·프롬프트·런타임·검증·재시도 경로로 수행하는 평가.",
    "description": "오프라인 평가가 운영 성능을 추정하려면 serving pipeline의 핵심 조건을 재현해야 한다. 별도의 stress test는 가능하지만 production parity 결과와 혼합해서 보고하면 안 된다.",
    "example": "프로덕션이 json_object+repair를 사용하면 동일 경로의 최종 성공률과 latency를 측정한다.",
    "related": [
      "train-serve-eval-skew",
      "benchmark",
      "repair-loop",
      "contract-compliance"
    ],
    "keywords": [
      "parity",
      "production",
      "serving"
    ]
  },
  {
    "id": "evidence",
    "term": "근거",
    "english": "Evidence",
    "aliases": [
      "증거",
      "근거 자료"
    ],
    "category": "LLM·생성형 AI",
    "level": "입문",
    "short": "답변의 주장이나 판단을 지지하는 입력 데이터, 문서, 도구 결과 또는 관측 사실.",
    "description": "근거는 단순히 함께 제시된 문장이 아니라 특정 주장을 실제로 지지해야 한다. 출처, 시점, 범위, 신뢰도와 주장 간 entailment를 확인해야 한다.",
    "example": "지원자의 이력서에 적힌 Java 3년 경력은 Java 경험 판단의 근거다.",
    "related": [
      "grounding",
      "citation",
      "rag"
    ],
    "keywords": [
      "source",
      "proof",
      "support"
    ]
  },
  {
    "id": "api-contract",
    "term": "API 계약",
    "english": "API Contract",
    "aliases": [
      "인터페이스 계약"
    ],
    "category": "개발·웹",
    "level": "중급",
    "short": "API 요청과 응답이 따라야 할 구조, 타입, 상태 코드, 의미 규칙의 합의.",
    "description": "OpenAPI나 JSON Schema로 일부를 표현할 수 있지만 idempotency, 오류 의미, 필드 간 조건 같은 운영 규칙도 포함된다. 생산자와 소비자가 같은 계약을 해석해야 한다.",
    "example": "score는 0~100 정수이고 실패 시 errorCode를 반환한다는 규칙.",
    "related": [
      "contract-compliance",
      "json-schema",
      "validation"
    ],
    "keywords": [
      "OpenAPI",
      "interface",
      "schema"
    ]
  },
  {
    "id": "validator",
    "term": "검증기",
    "english": "Validator",
    "aliases": [
      "유효성 검사기"
    ],
    "category": "개발·웹",
    "level": "입문",
    "short": "데이터나 출력이 정의된 규칙을 만족하는지 검사하고 오류를 보고하는 구성 요소.",
    "description": "parser가 문법을 읽는 역할이라면 validator는 구조, 타입, 범위, 업무 규칙을 확인한다. 여러 단계의 validator를 조합할 수 있다.",
    "example": "JSON 파싱 후 required 필드와 enum 값을 검사한다.",
    "related": [
      "validation",
      "json-schema",
      "business-rule-validation",
      "repair-loop"
    ],
    "keywords": [
      "validate",
      "constraint"
    ]
  },
  {
    "id": "fallback",
    "term": "폴백",
    "english": "Fallback",
    "aliases": [
      "대체 경로"
    ],
    "category": "클라우드·인프라",
    "level": "입문",
    "short": "주 경로가 실패했을 때 기능을 완전히 중단하지 않도록 사용하는 대체 처리 경로.",
    "description": "다른 모델, 캐시, 목데이터, 제한된 기능, 사용자 고지 등으로 구성할 수 있다. 폴백은 실패를 숨기는 수단이 아니라 품질 저하와 데이터 신선도를 명시해야 하는 복원 전략이다.",
    "example": "자체 LLM 실패 시 외부 모델로 전환하고 모두 실패하면 안전한 기본 응답을 반환한다.",
    "related": [
      "repair-loop",
      "retry",
      "circuit-breaker"
    ],
    "keywords": [
      "degradation",
      "recovery"
    ]
  },
  {
    "id": "decoder",
    "term": "디코더",
    "english": "Decoder",
    "aliases": [
      "생성 디코더"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "모델의 확률 분포에서 다음 토큰을 선택하며 출력을 순차 생성하는 부분 또는 구조.",
    "description": "Transformer decoder architecture와 decoding algorithm은 구분해야 한다. 생성 시 greedy, beam, sampling, constrained decoding 등의 정책이 logits를 토큰으로 바꾼다.",
    "example": "grammar-constrained decoder는 허용되지 않는 다음 토큰의 확률을 마스킹한다.",
    "related": [
      "inference",
      "sampling",
      "constrained-decoding",
      "transformer"
    ],
    "keywords": [
      "logits",
      "generation"
    ]
  },
  {
    "id": "schema",
    "term": "스키마",
    "english": "Schema",
    "aliases": [
      "데이터 구조 정의"
    ],
    "category": "데이터·DB",
    "level": "입문",
    "short": "데이터가 어떤 필드, 타입, 관계와 제약을 가져야 하는지 정의한 구조.",
    "description": "데이터베이스 스키마, JSON Schema, Avro schema 등 맥락에 따라 구체적인 표현이 다르다. 구조 정의와 실제 데이터의 의미적 정확성은 구분해야 한다.",
    "example": "사용자 테이블의 id, email, created_at 타입과 제약을 정의한다.",
    "related": [
      "json-schema",
      "database-schema",
      "api-contract"
    ],
    "keywords": [
      "structure",
      "type",
      "constraint"
    ]
  },
  {
    "id": "baseline",
    "term": "베이스라인",
    "english": "Baseline",
    "aliases": [
      "기준선",
      "기준 모델"
    ],
    "category": "AI·머신러닝",
    "level": "입문",
    "short": "새 방법의 효과를 판단하기 위해 비교하는 명확한 기준 시스템이나 설정.",
    "description": "베이스라인은 약한 모델을 임의로 고르는 것이 아니라 실제 대안, 기존 production, 단순 규칙 등 의사결정에 의미 있는 기준이어야 한다.",
    "example": "base+schema를 LoRA+schema와 비교해 LoRA의 도메인 품질 기여를 분리한다.",
    "related": [
      "ablation-study",
      "benchmark",
      "evaluation-metric"
    ],
    "keywords": [
      "control",
      "comparison"
    ]
  },
  {
    "id": "regularization",
    "term": "정규화 기법",
    "english": "Regularization",
    "aliases": [
      "규제",
      "일반화 제어"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "학습 데이터에 지나치게 맞추는 것을 줄여 새로운 데이터에서 성능을 높이려는 기법의 총칭.",
    "description": "weight decay, dropout, data augmentation, early stopping, label smoothing 등이 포함된다. 한국어에서 normalization도 정규화라 번역되므로 문맥을 구분해야 한다.",
    "example": "LoRA dropout과 early stopping으로 작은 데이터셋 과적합을 완화한다.",
    "related": [
      "overfitting",
      "dropout",
      "early-stopping"
    ],
    "keywords": [
      "generalization",
      "weight decay"
    ]
  },
  {
    "id": "regression-test",
    "term": "회귀 테스트",
    "english": "Regression Test",
    "aliases": [
      "리그레션 테스트"
    ],
    "category": "보안·품질",
    "level": "입문",
    "short": "변경 후 기존에 잘 되던 기능이나 품질이 다시 나빠지지 않았는지 확인하는 테스트.",
    "description": "코드 기능뿐 아니라 모델의 일반 능력, 출력 계약, latency, 안전성에도 적용할 수 있다. 기준 버전의 결과와 허용 오차를 명시한다.",
    "example": "r32로 전환한 뒤 비IT 샘플과 JSON 형식 성공률이 악화되지 않았는지 확인한다.",
    "related": [
      "catastrophic-forgetting",
      "benchmark",
      "ci"
    ],
    "keywords": [
      "regression",
      "quality gate"
    ]
  },
  {
    "id": "reranking",
    "term": "리랭킹",
    "english": "Reranking",
    "aliases": [
      "재순위화"
    ],
    "category": "LLM·생성형 AI",
    "level": "중급",
    "short": "1차 검색 후보를 더 정교한 모델이나 규칙으로 다시 평가해 순서를 바꾸는 단계.",
    "description": "벡터 검색의 높은 recall을 유지하면서 cross-encoder나 LLM judge로 relevance precision을 높일 수 있다. 비용과 지연시간이 증가한다.",
    "example": "상위 50개 chunk를 검색한 뒤 cross-encoder로 상위 5개를 선택한다.",
    "related": [
      "rag",
      "semantic-search",
      "embedding"
    ],
    "keywords": [
      "cross encoder",
      "ranking"
    ]
  },
  {
    "id": "citation",
    "term": "인용",
    "english": "Citation",
    "aliases": [
      "출처 표기"
    ],
    "category": "LLM·생성형 AI",
    "level": "입문",
    "short": "답변의 주장이 어떤 원문이나 데이터에서 왔는지 추적할 수 있게 표시하는 정보.",
    "description": "링크만 붙이는 것보다 주장 단위로 정확한 passage와 연결해야 한다. citation correctness와 evidence quality를 별도로 평가할 수 있다.",
    "example": "시험 일정 문장 뒤에 공식 API 응답의 종목명과 기준일을 표시한다.",
    "related": [
      "evidence",
      "grounding",
      "rag"
    ],
    "keywords": [
      "source attribution",
      "reference"
    ]
  },
  {
    "id": "validation",
    "term": "유효성 검증",
    "english": "Validation",
    "aliases": [
      "검증"
    ],
    "category": "개발·웹",
    "level": "입문",
    "short": "입력이나 결과가 정의된 규칙과 기대를 만족하는지 확인하는 과정.",
    "description": "문법, 타입, 범위, 데이터베이스 제약, 업무 규칙, 보안 정책 등 여러 층으로 나뉜다. 실패 원인을 구체적으로 반환해야 repair와 사용자 피드백이 가능하다.",
    "example": "이메일 형식 검사 후 중복 계정 여부를 데이터베이스에서 확인한다.",
    "related": [
      "validator",
      "business-rule-validation",
      "api-contract"
    ],
    "keywords": [
      "check",
      "constraint"
    ]
  },
  {
    "id": "rule-engine",
    "term": "규칙 엔진",
    "english": "Rule Engine",
    "aliases": [
      "룰 엔진"
    ],
    "category": "개발·웹",
    "level": "중급",
    "short": "명시적인 조건과 결론을 코드나 규칙 데이터로 관리하고 실행하는 시스템.",
    "description": "LLM의 확률적 판단과 달리 동일 입력에 결정적인 정책을 적용하는 데 적합하다. 규칙 충돌, 우선순위, 버전 관리와 설명 가능성이 중요하다.",
    "example": "필수 경력 미달이면 HOLD를 우선 적용하고 보완 조건을 계산한다.",
    "related": [
      "business-rule-validation",
      "fallback",
      "decision-table"
    ],
    "keywords": [
      "deterministic",
      "policy"
    ]
  },
  {
    "id": "parser",
    "term": "파서",
    "english": "Parser",
    "aliases": [
      "구문 분석기"
    ],
    "category": "개발·웹",
    "level": "중급",
    "short": "문자열이나 토큰 열을 문법 규칙에 따라 구조화된 데이터로 해석하는 프로그램.",
    "description": "lexer가 토큰을 만들고 parser가 syntax tree를 구성하는 전통적 구조가 있으며, JSON parser처럼 한 단계로 제공되기도 한다. parsing 성공은 의미 검증 성공과 다르다.",
    "example": "JSON 문자열을 객체로 변환하거나 문법 오류 위치를 반환한다.",
    "related": [
      "peg-grammar",
      "syntactic-validity",
      "validator"
    ],
    "keywords": [
      "AST",
      "grammar",
      "parse"
    ]
  },
  {
    "id": "domain-adaptation",
    "term": "도메인 적응",
    "english": "Domain Adaptation",
    "aliases": [
      "도메인 특화"
    ],
    "category": "AI·머신러닝",
    "level": "중급",
    "short": "모델을 특정 산업, 문체, 데이터 분포나 작업 환경에 더 잘 맞도록 조정하는 과정.",
    "description": "미세조정, continued pretraining, RAG, vocabulary 변경 등 여러 방법이 있다. 작업 형식 적응과 최신 사실 주입을 구분해 적절한 방법을 선택해야 한다.",
    "example": "일반 LLM을 채용 전략 판단과 근거 설명 패턴에 맞게 LoRA로 조정한다.",
    "related": [
      "fine-tuning",
      "instruction-tuning",
      "rag",
      "catastrophic-forgetting"
    ],
    "keywords": [
      "domain shift",
      "adaptation"
    ]
  }
];
  const current = Array.isArray(window.AIDICTIONARY_TERMS) ? window.AIDICTIONARY_TERMS : [];
  const existingIds = new Set(current.map((term) => term.id));
  window.AIDICTIONARY_TERMS = current.concat(additions.filter((term) => !existingIds.has(term.id)));
})();
